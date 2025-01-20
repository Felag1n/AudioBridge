export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
  }
  
  export interface IUser {
    id: number;
    email: string;
    nickname: string;
    password?: string;
    avatarUrl?: string;
    role: UserRole;
    isActive: boolean;
    yandexId?: string;
    accessToken?: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
  }