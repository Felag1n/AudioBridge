import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  audioUrl: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  genreId: number;

  @IsOptional()
  @IsNumber()
  artistId?: number;

  @IsOptional()
  @IsString()
  yandexId?: string;
}