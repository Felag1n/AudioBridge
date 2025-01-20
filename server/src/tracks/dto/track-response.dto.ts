import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  audioUrl: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  @IsOptional()
  artistId?: number;

  @IsNumber()
  genreId: number;

  @IsString()
  @IsOptional()
  yandexId?: string;
}