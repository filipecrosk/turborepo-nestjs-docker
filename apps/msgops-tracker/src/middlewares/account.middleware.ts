import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MsgopsService } from '../msgops/msgops.service';
import { GlobalService } from '../utils/global.service';

@Injectable()
export class AccountMiddleware implements NestMiddleware {
  constructor(private readonly msgopsService: MsgopsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['api-key']) {
      const accountConfig = await this.msgopsService.findByConfig('api_key_tracker', req.headers['api-key'].toString());
      GlobalService.accountId = accountConfig?.accountId || null;
    }

    if (!GlobalService.accountId) {
      throw new HttpException('[Unauthorized]', HttpStatus.UNAUTHORIZED);
    }

    const acceptOrigins = ['plusdin.com.br'];
    if (!req.get('origin') || !acceptOrigins.some((domain) => req.get('origin').includes(domain))) {
      throw new HttpException('[Unauthorized]', HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}
