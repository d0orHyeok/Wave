import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentailDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentailDto: AuthCredentailDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentailDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentailDto: AuthCredentailDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentailDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('user', user);
  }
}
