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
    const userData = await this.authService.getUserData(user);
    return { userData };
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
    const likes = await this.authService.likeMusic(user, musicId);
    return { likes };
  }

  @Patch('/:musicId/unlike')
  @UseGuards(JwtAuthGuard)
  async unlikeMusic(
    @GetUser() user: User,
    @Param('musicId', ParseIntPipe) musicId: number,
  ) {
    const likes = await this.authService.unlikeMusic(user, musicId);
    return { likes };
  }

  @Patch('/:followerId/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(
    @GetUser() user: User,
    @Param('followerId') followerId: string,
  ) {
    return this.authService.followUser(user, followerId);
  }

  @Patch('/:followerId/unfollow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @GetUser() user: User,
    @Param('followerId') followerId: string,
  ) {
    return this.authService.unfollowUser(user, followerId);
  }
}
