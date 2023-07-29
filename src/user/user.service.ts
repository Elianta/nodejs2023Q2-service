import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DbService } from 'src/db/db.service';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { User } from 'src/types';
import { ERR_MESSAGES } from 'src/constants';

const CRYPT_SALT = parseInt(process.env.CRYPT_SALT ?? '10', 10);

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  findAll() {
    return this.db.getAllUsers();
  }

  findOne(id: string) {
    const user = this.db.getOneUser(id);
    if (user === null) {
      throw new NotFoundException(ERR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.password, CRYPT_SALT);

    const user = this.db.createUser({
      data: {
        login: dto.login,
        hash,
      },
    });

    return user;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = this.db.getOneUser(id, false) as User | null;
    if (user === null) {
      throw new NotFoundException(ERR_MESSAGES.USER_NOT_FOUND);
    }

    const pwMatches = await bcrypt.compare(dto.oldPassword, user.passwordHash);

    if (!pwMatches)
      throw new ForbiddenException(ERR_MESSAGES.OLD_PASSWORD_WRONG);

    const newHash = await bcrypt.hash(dto.newPassword, CRYPT_SALT);
    const updatedUser = this.db.updateUser({
      data: {
        id,
        userData: {
          passwordHash: newHash,
        },
      },
    });
    return updatedUser as User;
  }

  deleteOne(id: string) {
    const deletedId = this.db.deleteOneUser(id);
    if (deletedId === null) {
      throw new NotFoundException(ERR_MESSAGES.USER_NOT_FOUND);
    }
  }
}
