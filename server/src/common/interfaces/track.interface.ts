export interface ITrack {
    id: number;
    title: string;
    description?: string;
    audioUrl: string;
    coverUrl?: string;
    duration: number;
    plays: number;
    yandexId?: string;
    userId: number;
    artistId?: number;
    genreId: number;
    createdAt: Date;
    updatedAt: Date;
  }