import { AuthRegisterDto } from './dto/auth-register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwTRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentailDto } from './dto/auth-credential.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Response } from 'express';
import { AuthLikesDto } from './dto/auth-likes.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authRegisterDto: AuthRegisterDto,
  ): Promise<void> {
    await this.authService.signUp(authRegisterDto);
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
    return;
  }

  @Post('/refresh')
  @UseGuards(JwTRefreshGuard)
  refreshAccessToken(@GetUser() user: User) {
    const payload = { id: user.id };
    const accessToken = this.authService.getAccessToken(payload);
    return { accessToken };
  }

  @Get('/info')
  @UseGuards(JwtAuthGuard)
  getUserData(@GetUser() user: User) {
    const userData = this.authService.getUserData(user);
    return { userData };
  }

  @Put('/musics/like')
  @UseGuards(JwtAuthGuard)
  async pushLikes(@GetUser() user: User, @Body() body: AuthLikesDto) {
    const { musicId } = body;
    const userData = await this.authService.pushLikes(user, musicId);
    return { userData };
  }

  @Put('/musics/unlike')
  @UseGuards(JwtAuthGuard)
  async pullLikes(@GetUser() user: User, @Body() body: AuthLikesDto) {
    const { musicId } = body;
    const userData = await this.authService.pullLikes(user, musicId);
    return { userData };
  }
}
