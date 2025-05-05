export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  file_path: string;
  file_url: string;
  cover_url: string;
  created_at: string;
  user: number;
  is_liked?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  description?: string;
  genre?: string;
  releaseDate?: string;
  createdAt: string;
  tracksCount: number;
  likesCount: number;
  isLiked?: boolean;
  userId: string;
} 