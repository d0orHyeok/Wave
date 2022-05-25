import { AuthProfileDto } from './dto/auth-profile.dto';
import { AuthRegisterPipe } from './pipes/auth-register.pipe';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwTRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentailDto } from './dto/auth-credential.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(AuthRegisterPipe)
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

    const payload = { id: user.id, username: user.username };

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
    const payload = { id: user.id, username: user.username };
    const accessToken = this.authService.getAccessToken(payload);
    return { accessToken };
  }

  @Get('/info')
  @UseGuards(JwtAuthGuard)
  async getUserData(@GetUser() user: User) {
    return user;
  }

  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  async updateUserDesc(
    @GetUser() user: User,
    @Body(ValidationPipe) authProfileDto: AuthProfileDto,
  ) {
    return this.authService.updateProfileData(user, authProfileDto);
  }

  @Patch('/image/update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @GetUser() user: User,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.authService.updateProfileImage(user, image);
  }

  @Patch('/image/delete')
  @UseGuards(JwtAuthGuard)
  async deleteProfileImage(@GetUser() user: User) {
    return this.authService.deleteProfileImage(user);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.authService.findUserById(id);
  }

  @Patch('/:musicId/like')
  @UseGuards(JwtAuthGuard)
  async likeMusic(
    @GetUser() user: User,
    @Param('musicId', ParseIntPipe) musicId: number,
  ) {
    return this.authService.toggleLikeMusic(user, musicId);
  }

  @Patch('/:targetId/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(@GetUser() user: User, @Param('targetId') targetId: string) {
    return this.authService.toggleFollow(user, targetId);
  }

  @Patch('/:musicId/repost/music')
  @UseGuards(JwtAuthGuard)
  async repostMusic(@GetUser() user: User, @Param('musicId') musicId: number) {
    return this.authService.toggleRepostMusic(user, musicId);
  }
}
