import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { ERR_MESSAGES } from 'src/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserEntity } from './entity/user.entity';
import { plainToInstance } from 'class-transformer';

const CRYPT_SALT = parseInt(process.env.CRYPT_SALT ?? '10', 10);

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return plainToInstance(UserEntity, await this.prisma.user.findMany());
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (user === null) {
      throw new NotFoundException(ERR_MESSAGES.USER_NOT_FOUND);
    }

    return plainToInstance(UserEntity, user);
  }

  async create(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.password, CRYPT_SALT);

    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        passwordHash: hash,
      },
    });

    return plainToInstance(UserEntity, user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (user === null) {
      throw new NotFoundException(ERR_MESSAGES.USER_NOT_FOUND);
    }

    const pwMatches = await bcrypt.compare(dto.oldPassword, user.passwordHash);

    if (!pwMatches)
      throw new ForbiddenException(ERR_MESSAGES.OLD_PASSWORD_WRONG);

    const newHash = await bcrypt.hash(dto.newPassword, CRYPT_SALT);

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        passwordHash: newHash,
        version: user.version + 1,
      },
    });
    return plainToInstance(UserEntity, updatedUser);
  }

  async deleteOne(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ERR_MESSAGES.USER_NOT_FOUND);
        }
      }
      throw error;
    }
  }
}
