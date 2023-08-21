import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { handleUniqueConstraintFailed } from 'src/utils';
import { AuthDto, RefreshAuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';

const REFRESH_TOKEN_OPTIONS = {
  expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
  secret: process.env.JWT_SECRET_REFRESH_KEY,
};

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
      refreshToken: await this.jwtService.signAsync(
        payload,
        REFRESH_TOKEN_OPTIONS,
      ),
    };
  }

  async refresh(refreshAuthDto: RefreshAuthDto) {
    const { userId, login } = this.jwtService.verify(
      refreshAuthDto.refreshToken,
      {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      },
    );

    const user = await this.userService.findById(userId);
    if (user.login !== login) {
      throw new UnauthorizedException();
    }

    const payload = {
      userId: user.id,
      login: user.login,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(
        payload,
        REFRESH_TOKEN_OPTIONS,
      ),
    };
  }
}
