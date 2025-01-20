export interface YandexTrack {
    id: string;
    title: string;
    artists: YandexArtist[];
    albums: YandexAlbum[];
    duration_ms: number;
    cover_uri?: string;
    genres?: string[];
  }
  
  export interface YandexArtist {
    id: string;
    name: string;
    cover?: {
      uri?: string;
    };
    description?: {
      text?: string;
    };
  }
  
  export interface YandexAlbum {
    id: string;
    title: string;
    year: number;
    genre?: string;
    cover_uri?: string;
  }
  
  export interface SearchParams {
    query: string;
    page?: number;
    pageSize?: number;
  }