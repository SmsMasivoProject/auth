import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './user/guards/local-auth.guard';
import { Public } from './user/decorators/public.decorator';
import { UserService } from './user/user.service';
import { Response } from 'express';
import { JwtAuthGuard } from './user/guards/jwt-auth.guard';
import { RefreshTokenGuard } from './user/guards/refresh-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/auth/signin')
  async signin(@Req() request: any, @Res() response: Response) {
    const user = request.user;
    const payload = await this.userService.signin({key: user.key, roles: user.roles});
    user.secret = undefined;
    return response.status(HttpStatus.OK).send(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth/logout')
  logout(@Req() request: any) {
    let token = request.get('Authorization').replace('Bearer', '').trim();
    this.userService.logout(token);
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Get('/auth/refresh')
  refreshTokens(@Req() req: any) {
    const userId = req.user['key'];
    const refreshToken = req.user['refreshToken'];
    return this.userService.refreshTokens(userId, refreshToken);
  }
}
