import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { YandexTrack, YandexArtist, SearchParams } from './interfaces/yandex-music.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YandexMusicService {
  private readonly API_BASE_URL = 'https://api.music.yandex.net';
  private readonly ACCESS_TOKEN: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.ACCESS_TOKEN = this.configService.get<string>('yandex.accessToken');
  }

  private get headers() {
    return {
      Authorization: `OAuth ${this.ACCESS_TOKEN}`,
      Accept: 'application/json',
    };
  }

  async search({ query, page = 0, pageSize = 20 }: SearchParams) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.API_BASE_URL}/search`, {
          headers: this.headers,
          params: {
            text: query,
            page,
            page_size: pageSize,
            type: ['track', 'artist'],
          },
        })
      );
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch data from Yandex Music',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  async getTrackInfo(trackId: string): Promise<YandexTrack> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.API_BASE_URL}/tracks/${trackId}`, {
          headers: this.headers,
        })
      );
      return data;
    } catch (error) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
  }

  async importTrack(trackId: string, userId: number) {
    const track = await this.getTrackInfo(trackId);
    const artist = track.artists[0];
    
    let dbArtist = await this.prisma.artist.findUnique({
      where: { yandexId: artist.id }
    });

    if (!dbArtist) {
      dbArtist = await this.prisma.artist.create({
        data: {
          name: artist.name,
          yandexId: artist.id,
          imageUrl: this.getCoverUrl(artist.cover?.uri),
          description: artist.description?.text
        }
      });
    }

    let genre = await this.prisma.genre.findFirst({
      where: { name: track.genres?.[0] || 'Other' }
    });

    if (!genre) {
      genre = await this.prisma.genre.create({
        data: { name: track.genres?.[0] || 'Other' }
      });
    }

    const audioUrl = await this.getTrackDownloadUrl(trackId);

    return this.prisma.track.create({
      data: {
        title: track.title,
        yandexId: track.id,
        audioUrl,
        coverUrl: this.getCoverUrl(track.cover_uri),
        duration: Math.floor(track.duration_ms / 1000),
        userId,
        artistId: dbArtist.id,
        genreId: genre.id
      },
      include: {
        artist: true,
        genre: true
      }
    });
  }

  private async getTrackDownloadUrl(trackId: string): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.API_BASE_URL}/tracks/${trackId}/download-info`, {
          headers: this.headers,
        })
      );
      
      // Здесь нужно обработать ответ API и получить прямую ссылку на скачивание
      // В реальном приложении это будет зависеть от API Яндекс.Музыки
      return `${data.downloadUrl}`;
    } catch (error) {
      throw new HttpException(
        'Failed to get track download URL',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  private getCoverUrl(coverUri?: string): string | null {
    if (!coverUri) return null;
    return `https://${coverUri.replace('%%', '200x200')}`;
  }
}