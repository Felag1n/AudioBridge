import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto, userId: number) {
    return this.prisma.track.create({
      data: {
        ...createTrackDto,
        userId,
      },
      include: {
        user: true,
        artist: true,
        genre: true,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [tracks, total] = await Promise.all([
      this.prisma.track.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          artist: true,
          genre: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.track.count(),
    ]);

    return {
      data: tracks,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        user: true,
        artist: true,
        genre: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: number, updateTrackDto: UpdateTrackDto, userId: number) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    if (track.userId !== userId) {
      throw new ForbiddenException('You can only update your own tracks');
    }

    return this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
      include: {
        user: true,
        artist: true,
        genre: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    if (track.userId !== userId) {
      throw new ForbiddenException('You can only delete your own tracks');
    }

    await this.prisma.track.delete({
      where: { id },
    });

    return { success: true };
  }

  async incrementPlays(id: number) {
    return this.prisma.track.update({
      where: { id },
      data: {
        plays: {
          increment: 1,
        },
      },
    });
  }
}