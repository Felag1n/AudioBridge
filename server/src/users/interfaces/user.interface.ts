export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface JwtUser {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
}