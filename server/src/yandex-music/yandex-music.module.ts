import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { YandexMusicService } from './yandex-music.service';
import { YandexMusicController } from './yandex-music.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PrismaModule
  ],
  controllers: [YandexMusicController],
  providers: [YandexMusicService],
  exports: [YandexMusicService],
})
export class YandexMusicModule {}