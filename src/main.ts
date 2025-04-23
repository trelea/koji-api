// import './@types/express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config';
import * as cookieParser from 'cookie-parser';
import { createLogger } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(createLogger(winstonConfig)),
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin:
      configService.getOrThrow<string>('ORIGIN') || 'http://localhost:5173',
    credentials: true,
  });

  app.set('trust proxy', true);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
