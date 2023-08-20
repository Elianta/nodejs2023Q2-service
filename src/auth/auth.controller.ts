import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
