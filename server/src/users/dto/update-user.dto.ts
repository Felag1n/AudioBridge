import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(2, 30)
  nickname?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  bio?: string;
}