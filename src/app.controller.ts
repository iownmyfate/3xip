import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { CustomResponse } from './common/types/custom-response.type';
import type { CustomRequest } from './common/types/custom-request.type';

const view = 'pages/index';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(@Req() req: CustomRequest, @Res() res: CustomResponse) {
    const data = {
      view,
    };

    return res.render(data);
  }
}
