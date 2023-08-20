import { Injectable } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { handleUniqueConstraintFailed } from 'src/utils';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
    } catch (error) {
      handleUniqueConstraintFailed(error, ERR_MESSAGES.USER_EXISTS);
      throw error;
    }
  }

  async login(authDto: AuthDto) {
    const user = await this.userService.verifyCredentials(authDto);
    const payload = { userId: user.id, login: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
