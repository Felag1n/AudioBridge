import { IsString, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  nickname?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  isActive?: boolean;
}