import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AccountEntity } from './entities/account.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<AccountEntity[]> {
    return this.appService.getHello();
  }
}
