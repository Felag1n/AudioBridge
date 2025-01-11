import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTrackDto: CreateTrackDto & { audioUrl: string, coverUrl?: string }) {
    const data: any = {
      title: createTrackDto.title,
      description: createTrackDto.description,
      audioUrl: createTrackDto.audioUrl,
      coverUrl: createTrackDto.coverUrl,
      user: {
        connect: { id: userId }
      },
      genre: {
        connect: { id: createTrackDto.genreId }
      }
    };
  
    return this.prisma.track.create({
      data,
      include: {
        user: true,
        genre: true,
      },
    });
  }

  async findAll() {
    return this.prisma.track.findMany({
      include: {
        user: true,
        genre: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        user: true,
        genre: true,
        likes: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async toggleLike(trackId: number, userId: number) {
    const like = await this.prisma.like.findFirst({
      where: {
        trackId,
        userId,
      },
    });

    if (like) {
      await this.prisma.like.delete({
        where: { id: like.id },
      });
      return { liked: false };
    }

    await this.prisma.like.create({
      data: {
        track: {
          connect: { id: trackId }
        },
        user: {
          connect: { id: userId }
        }
      },
    });
    return { liked: true };
  }

  async addComment(trackId: number, userId: number, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        track: {
          connect: { id: trackId }
        },
        user: {
          connect: { id: userId }
        }
      },
      include: {
        user: true,
      },
    });
  }
}