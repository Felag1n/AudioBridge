import { Controller, Get, Post, Query, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { YandexMusicService } from './yandex-music.service';
import { User } from '../common/decorators/user.decorator';
import { SearchParams } from './interfaces/yandex-music.interface';

@Controller('yandex-music')
export class YandexMusicController {
  constructor(private readonly yandexMusicService: YandexMusicService) {}

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ) {
    return this.yandexMusicService.search({ query, page, pageSize });
  }

  @UseGuards(JwtAuthGuard)
  @Post('import/:trackId')
  async importTrack(
    @Param('trackId') trackId: string,
    @User('id') userId: number
  ) {
    return this.yandexMusicService.importTrack(trackId, userId);
  }

  @Get('track/:id')
  async getTrackInfo(@Param('id') trackId: string) {
    return this.yandexMusicService.getTrackInfo(trackId);
  }
}