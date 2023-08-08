import { Exclude, Type } from 'class-transformer';
import { User } from '@prisma/client';

export class UserEntity implements User {
  id: string;

  login: string;

  @Exclude()
  passwordHash: string;

  version: number;

  @Type(() => Number)
  createdAt: Date;

  @Type(() => Number)
  updatedAt: Date;
}
