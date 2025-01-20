import { UserRole } from '../../common/interfaces/user.interface';

export class AuthResponseDto {
  id: number;
  email: string;
  nickname: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
}