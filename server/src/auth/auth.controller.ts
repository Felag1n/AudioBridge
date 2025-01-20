import { Controller, Get, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth() {
    // Редирект на Яндекс выполняется автоматически
  }

  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(@Req() req: any, @Res() res: Response) {
    const tokens = await this.authService.handleYandexAuth(req.user);
    
    // Установка refresh token в httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('nodeEnv') === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    // Редирект на фронтенд с access token
    const frontendUrl = this.configService.get('cors.frontendUrl');
    res.redirect(`${frontendUrl}/auth/callback?token=${tokens.accessToken}`);
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(refreshToken);
  }
}