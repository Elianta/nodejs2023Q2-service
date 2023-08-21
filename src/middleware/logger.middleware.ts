import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`Http`);

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, query, body } = request;

    this.logger.log(
      `Request: ${method} ${originalUrl} | query: ${JSON.stringify(
        query,
      )} | body: ${JSON.stringify(body)}`,
    );

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log(
        `Response: ${method} ${originalUrl} | statusCode: ${statusCode} `,
      );
    });

    next();
  }
}
