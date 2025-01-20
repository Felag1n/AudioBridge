import { IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9_-]+$/, {
    message: 'Введите email или никнейм'
  })
  login: string;

  @IsString()
  @MinLength(6, {
    message: 'Пароль должен содержать минимум 6 символов'
  })
  password: string;
}