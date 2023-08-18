import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LoggerService } from './logger/logger.service';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new LoggerService();
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message} ${err.stack}`);
  });

  const document = yaml.load(
    (await readFile(join(process.cwd(), 'doc/api.yaml'))).toString('utf-8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
