import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private static LOG_FILE_PATH = 'logs/log.txt';
  private static ERROR_LOG_FILE_PATH = 'logs/error.log.txt';

  error(message: string, stackOrContext?: string) {
    super.error(message, stackOrContext);

    const formattedMessage = this.formatLogMessage(
      'error',
      message,
      stackOrContext,
    );
    this.writeToFile(formattedMessage, LoggerService.ERROR_LOG_FILE_PATH);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);

    const formattedMessage = this.formatLogMessage('warn', message, context);
    this.writeToFile(formattedMessage);
  }

  log(message: string, context?: string) {
    super.log(message, context);

    const formattedMessage = this.formatLogMessage('log', message, context);
    this.writeToFile(formattedMessage);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);

    const formattedMessage = this.formatLogMessage('debug', message, context);
    this.writeToFile(formattedMessage);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);

    const formattedMessage = this.formatLogMessage('verbose', message, context);
    this.writeToFile(formattedMessage);
  }

  private writeToFile(formattedMessage: string, extraFilePath?: string) {
    writeFile(LoggerService.LOG_FILE_PATH, formattedMessage, { flag: 'a' });

    extraFilePath &&
      writeFile(extraFilePath, formattedMessage, {
        flag: 'a',
      });
  }

  private formatLogMessage(
    logLevel: LogLevel,
    message: string,
    context: string = '',
  ) {
    return `${this.getTimestamp()}\t${logLevel.toUpperCase()}\t[${context}] ${message}\n`;
  }
}
