import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.artist.findMany({
      include: {
        _count: {
          select: {
            tracks: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        tracks: {
          include: {
            genre: true,
          },
        },
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async findByYandexId(yandexId: string) {
    return this.prisma.artist.findUnique({
      where: { yandexId },
    });
  }
}