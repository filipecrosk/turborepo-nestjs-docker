import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST || '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'msgops_prd',
      entities: [AccountEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([AccountEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
