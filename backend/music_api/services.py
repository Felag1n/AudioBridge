# music_api/services.py

from yandex_music import Client
from django.conf import settings
from typing import Optional, List, Dict, Any

class YandexMusicService:
    """Сервис для работы с API Яндекс Музыки"""
    
    def __init__(self):
        self.client = Client(settings.YANDEX_MUSIC_TOKEN).init()

    def get_track(self, track_id: str) -> Optional[Dict[str, Any]]:
        """Получение информации о треке"""
        try:
            track = self.client.tracks([track_id])[0]
            return {
                'id': str(track.id),
                'title': track.title,
                'artists': [{
                    'id': str(artist.id),
                    'name': artist.name
                } for artist in track.artists],
                'album': {
                    'id': str(track.albums[0].id) if track.albums else None,
                    'title': track.albums[0].title if track.albums else None,
                    'coverUrl': f"https://{track.albums[0].cover_uri.replace('%%', '200x200')}" if track.albums and track.albums[0].cover_uri else None
                },
                'duration': track.duration_ms / 1000,
                # Получаем прямую ссылку на аудио
                'downloadUrl': track.get_download_info()[0].get_direct_link() if track.get_download_info() else None
            }
        except Exception as e:
            print(f"Ошибка при получении трека: {e}")
            return None

    def search_tracks(self, query: str, page: int = 0, page_size: int = 20) -> List[Dict[str, Any]]:
        """Поиск треков"""
        try:
            search_result = self.client.search(query, type_='track')
            if not search_result or not search_result.tracks:
                return []

            tracks = search_result.tracks.results
            return [{
                'id': str(track.id),
                'title': track.title,
                'artists': [{
                    'id': str(artist.id),
                    'name': artist.name
                } for artist in track.artists],
                'album': {
                    'id': str(track.albums[0].id) if track.albums else None,
                    'title': track.albums[0].title if track.albums else None,
                    'coverUrl': f"https://{track.albums[0].cover_uri.replace('%%', '200x200')}" if track.albums and track.albums[0].cover_uri else None
                },
                'duration': track.duration_ms / 1000
            } for track in tracks[page*page_size:(page+1)*page_size]]
        except Exception as e:
            print(f"Ошибка при поиске треков: {e}")
            return []

    def get_popular_tracks(self) -> List[Dict[str, Any]]:
        """Получение популярных треков"""
        try:
            tracks = self.client.tracks_chart().chart.tracks
            return [{
                'id': str(track.track.id),
                'title': track.track.title,
                'artists': [{
                    'id': str(artist.id),
                    'name': artist.name
                } for artist in track.track.artists],
                'album': {
                    'id': str(track.track.albums[0].id) if track.track.albums else None,
                    'title': track.track.albums[0].title if track.track.albums else None,
                    'coverUrl': f"https://{track.track.albums[0].cover_uri.replace('%%', '200x200')}" if track.track.albums and track.track.albums[0].cover_uri else None
                },
                'duration': track.track.duration_ms / 1000
            } for track in tracks[:20]]  # Берем только первые 20 треков
        except Exception as e:
            print(f"Ошибка при получении популярных треков: {e}")
            return []