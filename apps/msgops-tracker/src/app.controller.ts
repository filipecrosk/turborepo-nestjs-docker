import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
  NotFoundException,
  Req,
  Res,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ContactEntity } from './msgops/entities/contact.entity';
import { MsgopsService } from './msgops/msgops.service';
import { SkipThrottle } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './guards/throttler-behind-proxy.guard';

@SkipThrottle()
@UseGuards(ThrottlerBehindProxyGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(private readonly msgOpsService: MsgopsService) {}

  @SkipThrottle(false)
  @Post('/c')
  async findContact(@Body() body: any): Promise<ContactEntity | any> {
    try {
      const buff = Buffer.from(body.data, 'base64');
      const params = JSON.parse(buff.toString('ascii'));

      const key = Object.keys(params);
      const propsFilter = ['e', 'h', 'u'];
      if (!key.length || !propsFilter.includes(key[0])) {
        throw new NotFoundException();
      }
      return this.msgOpsService.findContact(key[0], params[key[0]]);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @Get('/redirect')
  redirect(@Res() response: Response, @Req() request: Request, @Query('url') url: string) {
    const buff = Buffer.from(url, 'base64');
    const decodedUrl = buff.toString('ascii');
    const parsedUrl = new URL(decodeURIComponent(decodedUrl));
    const urlSearchParams = new URLSearchParams(parsedUrl.search);
    const urlParams = Object.fromEntries(urlSearchParams.entries());
    urlSearchParams.delete('bmsuuid');

    const domain = request.hostname.split('.');
    const rootDomain = domain
      .slice(0)
      .slice(-(domain.length === 4 ? 3 : 2))
      .join('.');

    const redirectTo = `${parsedUrl.origin}${parsedUrl.pathname}?${urlSearchParams.toString()}`;
    response.cookie('bmsUUID', `${urlParams.bmsuuid}`, { domain: rootDomain, path: '/', secure: true });
    return response.redirect(302, redirectTo);
  }
}
