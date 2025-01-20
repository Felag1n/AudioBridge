import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Nickname can only contain letters, numbers, underscores and dashes'
  })
  @MinLength(3)
  nickname: string;

  @IsString()
  @MinLength(6)
  password: string;
}