import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.SERVER_PORT;

  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
