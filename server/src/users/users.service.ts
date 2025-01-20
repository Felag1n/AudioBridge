import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;

    // Проверка на существование пользователя
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { nickname: rest.nickname },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or nickname already exists');
    }

    // Хэширование пароля если он предоставлен
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ...rest,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          nickname: true,
          avatarUrl: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tracks: {
          include: {
            genre: true,
            artist: true,
          },
        },
        likes: {
          include: {
            track: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;

    // Если предоставлен новый пароль, хэшируем его
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...rest,
          ...(hashedPassword && { password: hashedPassword }),
        },
        select: {
          id: true,
          email: true,
          nickname: true,
          avatarUrl: true,
          role: true,
          isActive: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return { success: true, message: 'User successfully deleted' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateAvatar(id: number, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
    });
  }
}