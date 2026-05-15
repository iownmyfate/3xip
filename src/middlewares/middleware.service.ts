import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { renderFile } from 'ejs';
import { CustomRequest } from '../common/types/custom-request.type';
import { CustomResponse } from '../common/types/custom-response.type';
import { ConfigService } from '@nestjs/config';
import { LogRepository } from '../models/logs/log.repository';

type RenderFileFn = (
  path: string,
  data: Record<string, unknown>,
) => Promise<string>;
const ejsRenderFile = renderFile as unknown as RenderFileFn;

@Injectable()
export class MiddlewareService implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly logRepository: LogRepository,
  ) {}

  private extractIp(req: CustomRequest): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      const raw = Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor;
      return raw.split(',')[0].trim();
    }

    const xRealIp = req.headers['x-real-ip'];
    if (xRealIp) {
      return Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
    }

    return req.socket?.remoteAddress ?? req.ip ?? '';
  }

  use(req: CustomRequest, res: CustomResponse, next: NextFunction) {
    res.render = (
      data: any = {},
      status = 200,
      layout = `${process.cwd()}/views/layout.ejs`,
    ): void => {
      ejsRenderFile(layout, {
        origin: req.origin,
        href: req.href,
        version: this.configService.get('VERSION'),
        ...data,
      })
        .then((html) => {
          res.status(status).send(html);
        })
        .catch((error: unknown) => {
          console.log(error);
        });
    };

    const ip = this.extractIp(req);
    const method = req.method;
    const path = req.path;
    const userAgent = (req.headers['user-agent'] as string) ?? '';
    const referer =
      ((req.headers['referer'] ?? req.headers['referrer']) as string) ?? '';
    const headers = req.headers as Record<string, string | string[]>;
    const startedAt = Date.now();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const duration = Date.now() - startedAt;

      // Structured stdout log — drained to NewRelic by Coolify
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'visitor',
          ip,
          method,
          path,
          statusCode,
          duration,
          userAgent,
          referer,
          headers,
        }),
      );

      // Persist to database (fire and forget)
      this.logRepository
        .create({ ip, method, path, userAgent, referer, headers, statusCode })
        .catch((err: unknown) => {
          console.error(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              level: 'error',
              message: 'Failed to persist visit log',
              error: String(err),
            }),
          );
        });
    });

    next();
  }
}
