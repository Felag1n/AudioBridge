import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-yandex';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/yandex/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.validateYandexUser(profile);
    return user;
  }
}
