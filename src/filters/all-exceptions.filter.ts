import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const { originalUrl, method, body, query } = ctx.getRequest();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as Record<any, any>)?.message
        : 'Internal server error';

    const error =
      exception instanceof HttpException
        ? (exception.getResponse() as Record<any, any>)?.error
        : undefined;

    const responseBody = {
      statusCode: httpStatus,
      error,
      message,
    };

    this.logger.error(
      `${method} ${originalUrl} | query: ${JSON.stringify(
        query,
      )} | body: ${JSON.stringify(body)} | httpStatus: ${httpStatus} `,
      AllExceptionsFilter.name,
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
