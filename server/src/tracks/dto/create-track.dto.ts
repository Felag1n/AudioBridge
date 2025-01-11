import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  audioUrl: string;

  @IsNumber()
  genreId: number;
}