import { Track } from './track-api';

export class LocalStorageService {
  private static readonly TRACKS_KEY = 'tracks';
  private static readonly ALBUMS_KEY = 'albums';

  // Track operations
  static saveTrack(track: Track): void {
    const tracks = this.getTracks();
    const existingIndex = tracks.findIndex(t => t.id === track.id);
    
    if (existingIndex >= 0) {
      tracks[existingIndex] = track;
    } else {
      tracks.push(track);
    }
    
    localStorage.setItem(this.TRACKS_KEY, JSON.stringify(tracks));
  }

  static getTracks(): Track[] {
    const tracksJson = localStorage.getItem(this.TRACKS_KEY);
    return tracksJson ? JSON.parse(tracksJson) : [];
  }

  static deleteTrack(trackId: string): void {
    const tracks = this.getTracks();
    const filteredTracks = tracks.filter(track => track.id !== trackId);
    localStorage.setItem(this.TRACKS_KEY, JSON.stringify(filteredTracks));
  }

  // Album operations
  static saveAlbum(album: Album): void {
    const albums = this.getAlbums();
    albums.push(album);
    localStorage.setItem(this.ALBUMS_KEY, JSON.stringify(albums));
  }

  static getAlbums(): Album[] {
    const albumsJson = localStorage.getItem(this.ALBUMS_KEY);
    return albumsJson ? JSON.parse(albumsJson) : [];
  }

  static deleteAlbum(albumId: string): void {
    const albums = this.getAlbums().filter(album => album.id !== albumId);
    localStorage.setItem(this.ALBUMS_KEY, JSON.stringify(albums));
  }

  // Clear all data
  static clearAll(): void {
    localStorage.removeItem(this.TRACKS_KEY);
    localStorage.removeItem(this.ALBUMS_KEY);
  }
} 