import { Injectable } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { handleUniqueConstraintFailed } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      await this.usersService.create(createUserDto);
    } catch (error) {
      handleUniqueConstraintFailed(error, ERR_MESSAGES.USER_EXISTS);
      throw error;
    }
  }
}
