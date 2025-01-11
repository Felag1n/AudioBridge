import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateYandexUser(profile: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.emails[0].value,
          nickname: profile.displayName || `user_${profile.id}`,
          yandexId: profile.id,
        },
      });
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}

// auth/auth.controller.ts