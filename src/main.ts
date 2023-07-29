import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import { readFile } from 'fs/promises';
import { join } from 'path';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const document = yaml.load(
    (await readFile(join(process.cwd(), 'doc/api.yaml'))).toString('utf-8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
