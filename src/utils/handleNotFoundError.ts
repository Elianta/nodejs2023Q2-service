import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type ExceptionType =
  | typeof NotFoundException
  | typeof UnprocessableEntityException;

export const handleNotFoundError = (
  error: any,
  msg: string,
  exceptionType: ExceptionType = NotFoundException,
) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      throw new exceptionType(msg);
    }
  }
};
