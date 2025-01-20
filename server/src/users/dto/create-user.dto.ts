import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  nickname: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}