import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentailDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentailDto: AuthCredentailDto,
  ): Promise<void> {
    await this.authService.signUp(authCredentailDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentailDto: AuthCredentailDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const user = await this.authService.validateUser(authCredentailDto);

    const payload = { id: user.id };

    const accessToken = this.authService.getAccessToken(payload);
    const { refreshToken, cookieOption } =
      this.authService.getCookieWithRefreshToken(payload);

    response.cookie('RefreshToken', refreshToken, cookieOption);

    return accessToken;
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('user', user);
  }
}
