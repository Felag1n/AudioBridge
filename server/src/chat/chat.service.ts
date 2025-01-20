import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto, senderId: number) {
    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        senderId,
        receiverId: createMessageDto.receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  async getMessages(userId: number, otherId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: userId },
              { receiverId: otherId },
            ],
          },
          {
            AND: [
              { senderId: otherId },
              { receiverId: userId },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  async markAsRead(userId: number, otherId: number) {
    return this.prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: otherId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}