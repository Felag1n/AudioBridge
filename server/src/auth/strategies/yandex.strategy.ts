import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-yandex';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.get('yandex.clientId'),
      clientSecret: configService.get('yandex.clientSecret'),
      callbackURL: configService.get('yandex.callbackURL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, displayName, emails } = profile;
    
    let user = await this.prisma.user.findUnique({
      where: { yandexId: id }
    });

    if (!user) {
      // Создаем нового пользователя если его нет
      user = await this.prisma.user.create({
        data: {
          email: emails[0].value,
          nickname: displayName || `user${Date.now()}`,
          yandexId: id,
          accessToken,
          refreshToken,
        },
      });
    } else {
      // Обновляем токены существующего пользователя
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken,
          refreshToken,
        },
      });
    }

    return user;
  }
}