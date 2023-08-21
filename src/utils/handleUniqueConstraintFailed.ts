import { ConflictException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const handleUniqueConstraintFailed = (error: any, msg: string) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException(msg);
    }
  }
};
