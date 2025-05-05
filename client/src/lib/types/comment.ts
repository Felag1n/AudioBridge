export interface Comment {
  id: number;
  text: string;
  user: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  created_at: string;
} 