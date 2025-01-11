import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth() {
    // Initiates the Yandex OAuth2 login flow
  }

  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(@Req() req) {
    // Handles the Yandex OAuth2 callback
    return this.authService.login(req.user);
  }
}