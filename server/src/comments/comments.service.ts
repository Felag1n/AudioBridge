import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findByTrackId(trackId: number) {
    return this.prisma.comment.findMany({
      where: { trackId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Can only update your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Can only delete your own comments');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return { success: true };
  }
}