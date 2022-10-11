import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MsgopsService } from './msgops.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { ContactEntity } from './entities/contact.entity';
import { AccountConfigEntity } from './entities/account-config.entity';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([AccountEntity, AccountConfigEntity, ContactEntity]),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    }),
  ],
  exports: [MsgopsService],
  providers: [MsgopsService],
})
export class MsgopsModule {}
