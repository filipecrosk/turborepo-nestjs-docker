import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(json({ limit: '5mb' }));
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, OPTIONS',
    preflightContinue: false,
  });
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  await app.listen(process.env.PORT || 3003);
}
bootstrap();
