import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { ERR_MESSAGES } from 'src/constants';
import { UserEntity } from './entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { handleNotFoundError } from 'src/utils';
import { AuthDto } from 'src/auth/dto';

const CRYPT_SALT = parseInt(process.env.CRYPT_SALT ?? '10', 10);

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return plainToInstance(UserEntity, await this.prisma.user.findMany());
  }

  async findById(id: string, plain = true) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (user === null) {
      throw new NotFoundException(ERR_MESSAGES.USER_NOT_FOUND);
    }

    return plain ? plainToInstance(UserEntity, user) : user;
  }

  async findByLogin(login: string, plain = true) {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (user === null) {
      throw new NotFoundException(ERR_MESSAGES.USER_NOT_FOUND);
    }

    return plain ? plainToInstance(UserEntity, user) : user;
  }

  async verifyCredentials(dto: AuthDto) {
    const user = await this.findByLogin(dto.login, false);

    const pwMatches = await this.verifyPassword(
      dto.password,
      user.passwordHash,
    );

    if (!pwMatches)
      throw new ForbiddenException(ERR_MESSAGES.OLD_PASSWORD_WRONG);

    return plainToInstance(UserEntity, user);
  }

  async verifyPassword(password: string, passwordHash: string) {
    const pwMatches = await bcrypt.compare(password, passwordHash);

    return pwMatches;
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
    const user = await this.findById(id, false);

    const pwMatches = await this.verifyPassword(
      dto.oldPassword,
      user.passwordHash,
    );
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
      handleNotFoundError(error, ERR_MESSAGES.USER_NOT_FOUND);
      throw error;
    }
  }
}
