import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsNumber()
  @IsOptional()
  artistId?: number;

  @IsNumber()
  @IsOptional()
  genreId?: number;
}