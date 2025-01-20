import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  nickname: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  yandexId?: string;
}