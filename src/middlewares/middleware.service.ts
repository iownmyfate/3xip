import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { renderFile } from 'ejs';
import { CustomRequest } from '../common/types/custom-request.type';
import { CustomResponse } from '../common/types/custom-response.type';
import { ConfigService } from '@nestjs/config';

type RenderFileFn = (
  path: string,
  data: Record<string, unknown>,
) => Promise<string>;
const ejsRenderFile = renderFile as unknown as RenderFileFn;

@Injectable()
export class MiddlewareService implements NestMiddleware {
  constructor(
    // private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

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

    next();
  }
}
