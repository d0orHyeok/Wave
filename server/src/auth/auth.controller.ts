import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwTRefreshGuard } from './guards/jwt-refresh.guard';
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
  ): Promise<{ accessToken: string }> {
    const user = await this.authService.validateUser(authCredentailDto);

    const payload = { id: user.id };

    const accessToken = this.authService.getAccessToken(payload);
    const { refreshToken, cookieOption } =
      this.authService.getRefreshTokenWithCookie(payload);
    await this.authService.setCurrentRefreshToken(refreshToken, user);

    response.cookie('RefreshToken', refreshToken, cookieOption);

    return { accessToken };
  }

  @Post('/signout')
  @UseGuards(JwTRefreshGuard)
  async siginOut(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookieOption = await this.authService.removeRefreshTokenWithCookie(
      user,
    );
    response.cookie('RefreshToken', '', cookieOption);
  }

  @Post('/test')
  @UseGuards(JwtAuthGuard)
  test(@GetUser() user: User) {
    console.log('user', user);
  }
}
