import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tracks: {
          include: {
            genre: true,
          }
        },
        likedTracks: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async getLikedTracks(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        likedTracks: {
          include: {
            genre: true,
          },
        },
      },
    });
  }

  async getUploadedTracks(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        tracks: {
          include: {
            genre: true,
          },
        },
      },
    });
  }
}