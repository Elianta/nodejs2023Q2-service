import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LoggerService } from './logger/logger.service';
import { LOG_LEVELS } from './constants';

const PORT = process.env.PORT || 4000;
const LOG_LEVEL = parseInt(process.env.LOG_LEVEL ?? '2', 10);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new LoggerService();
  app.useLogger(logger);
  app.useLogger(LOG_LEVELS.slice(0, LOG_LEVEL + 1));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message} ${err.stack}`);
  });

  process.on('unhandledRejection', (error) => {
    if (error instanceof Error) {
      logger.error(`UnhandledRejection: ${error.message}, ${error.stack}`);
    } else {
      logger.error(`UnhandledRejection: ${error}`);
    }
  });

  const document = yaml.load(
    (await readFile(join(process.cwd(), 'doc/api.yaml'))).toString('utf-8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
