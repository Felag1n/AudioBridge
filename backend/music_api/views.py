# Импорты необходимых модулей
import os
import logging
import requests
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from yandex_music import Client

from .models import YandexAccount, UserProfile, Track, UserLibrary
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    TrackSerializer,
    UserLibrarySerializer,
    UserUpdateSerializer
)

# Настройка логирования
logger = logging.getLogger(__name__)

#######################################
# Вспомогательные функции
#######################################

def get_yandex_client(user):
    """Получение клиента Яндекс Музыки для пользователя"""
    try:
        yandex_account = user.yandexaccount
        if yandex_account.is_token_expired():
            yandex_account.refresh_token()
        return Client(yandex_account.access_token).init()
    except Exception as e:
        logger.error(f"Ошибка при получении клиента Яндекс Музыки: {e}")
        return None

def create_auth_response(user):
    """Создает стандартный ответ при успешной аутентификации"""
    refresh = RefreshToken.for_user(user)
    profile = UserProfile.objects.get(user=user)
    
    return {
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'avatar_url': profile.avatar.url if profile.avatar else None
        },
        'token': str(refresh.access_token),
    }

#######################################
# API Endpoints
#######################################

@api_view(['GET'])
def api_root(request):
    """Корневой endpoint API."""
    return Response({
        'register': reverse('music_api:register', request=request),
        'login': reverse('music_api:login', request=request),
    })

#######################################
# Аутентификация и пользователи
#######################################

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Регистрация нового пользователя."""
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(create_auth_response(user), status=status.HTTP_201_CREATED)
        
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(
            {'message': 'Ошибка валидации', 'errors': serializer.errors}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response(
            {'message': 'Ошибка при регистрации', 'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Аутентификация пользователя."""
    try:
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {'message': 'Пользователь не найден'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            user = authenticate(username=user.username, password=password)
            if user:
                return Response(create_auth_response(user))
            
            return Response(
                {'message': 'Неверный пароль'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response(
            {'message': 'Ошибка при входе', 'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Обновление профиля пользователя"""
    try:
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            profile = UserProfile.objects.get(user=user)
            
            if 'avatar' in request.FILES:
                if profile.avatar:
                    # Delete old avatar file
                    if os.path.exists(profile.avatar.path):
                        os.remove(profile.avatar.path)
                profile.avatar = request.FILES['avatar']
                profile.save()
            
            avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
            
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'avatar_url': avatar_url
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        return Response({'message': 'Ошибка при обновлении профиля'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#######################################
# Яндекс.Музыка API
#######################################

@api_view(['POST'])
@permission_classes([AllowAny])
def yandex_auth(request):
    """Авторизация через Яндекс OAuth"""
    try:
        logger.info('Получен запрос на авторизацию через Яндекс')
        
        code = request.data.get('code')
        redirect_uri = request.data.get('redirect_uri')

        if not code:
            logger.error('Код авторизации отсутствует')
            return Response(
                {'error': 'Не предоставлен код авторизации'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        logger.info(f'Обмениваем код {code[:5]}... на токен с redirect_uri: {redirect_uri}')
        
        # Обмениваем код на токен
        token_url = 'https://oauth.yandex.ru/token'
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': settings.YANDEX_CLIENT_ID,
            'client_secret': settings.YANDEX_CLIENT_SECRET,
            'redirect_uri': redirect_uri
        }

        token_response = requests.post(token_url, data=token_data)
        logger.info(f'Получен ответ от Яндекс при обмене кода: {token_response.status_code}')
        
        if not token_response.ok:
            logger.error(f'Ошибка получения токена: {token_response.text}')
            return Response(
                {'error': f'Ошибка получения токена: {token_response.text}'}, 
                status=token_response.status_code
            )

        token_json = token_response.json()
        access_token = token_json.get('access_token')

        if not access_token:
            logger.error('Access token отсутствует в ответе')
            return Response(
                {'error': 'Не получен токен доступа'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Получаем информацию о пользователе
        user_info_url = 'https://login.yandex.ru/info'
        headers = {'Authorization': f'OAuth {access_token}'}
        
        logger.info('Запрос информации о пользователе')
        user_info_response = requests.get(user_info_url, headers=headers)
        logger.info(f'Получен ответ с информацией о пользователе: {user_info_response.status_code}')
        
        if not user_info_response.ok:
            logger.error(f'Ошибка получения информации о пользователе: {user_info_response.text}')
            return Response(
                {'error': 'Ошибка получения информации о пользователе'}, 
                status=user_info_response.status_code
            )

        user_info = user_info_response.json()

        # Создаем или получаем существующего пользователя
        logger.info('Создание/обновление пользователя')
        user, created = User.objects.get_or_create(
            username=f"yandex_{user_info['id']}", 
            defaults={
                'email': user_info.get('default_email', ''),
                'first_name': user_info.get('first_name', ''),
                'last_name': user_info.get('last_name', '')
            }
        )
        logger.info(f'Пользователь {"создан" if created else "получен"}')

        # Создаем или обновляем профиль пользователя
        profile, _ = UserProfile.objects.get_or_create(user=user)

        # Обновляем данные Яндекс аккаунта
        yandex_account, _ = YandexAccount.objects.update_or_create(
            yandex_id=user_info['id'],
            defaults={
                'user': user,
                'access_token': access_token,
                'refresh_token': token_json.get('refresh_token'),
                'expires_at': timezone.now() + timedelta(seconds=token_json.get('expires_in', 0))
            }
        )

        # Формируем ответ с токеном
        response_data = create_auth_response(user)
        
        logger.info('Авторизация успешно завершена')
        return Response(response_data)

    except Exception as e:
        logger.exception('Необработанная ошибка при авторизации через Яндекс')
        return Response(
            {'error': f'Ошибка при авторизации: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_yandex_track(request, track_id):
    """Получение информации о треке из Яндекс Музыки"""
    try:
        client = get_yandex_client(request.user)
        if not client:
            return Response(
                {'message': 'Необходима авторизация в Яндекс Музыке'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        track = client.tracks([track_id])[0]
        
        track_data = {
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
            'downloadUrl': track.get_download_info()[0].get_direct_link() if track.get_download_info() else None
        }
        
        return Response(track_data)
    except Exception as e:
        logger.error(f"Ошибка при получении трека: {e}")
        return Response(
            {'message': 'Ошибка при получении трека'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_yandex_tracks(request):
    """Поиск треков в Яндекс Музыке"""
    try:
        client = get_yandex_client(request.user)
        if not client:
            return Response(
                {'message': 'Необходима авторизация в Яндекс Музыке'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        query = request.GET.get('query', '')
        page = int(request.GET.get('page', 0))
        page_size = int(request.GET.get('page_size', 20))

        search_result = client.search(query, type_='track')
        if not search_result or not search_result.tracks:
            return Response([])

        tracks = search_result.tracks.results
        tracks_data = [{
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

        return Response(tracks_data)
    except Exception as e:
        logger.error(f"Ошибка при поиске треков: {e}")
        return Response(
            {'message': 'Ошибка при поиске треков'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_yandex_popular_tracks(request):
    """Получение популярных треков из Яндекс Музыки"""
    try:
        client = get_yandex_client(request.user)
        if not client:
            return Response(
                {'message': 'Необходима авторизация в Яндекс Музыке'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        tracks = client.tracks_chart().chart.tracks
        tracks_data = [{
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

        return Response(tracks_data)
    except Exception as e:
        logger.error(f"Ошибка при получении популярных треков: {e}")
        return Response(
            {'message': 'Ошибка при получении популярных треков'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def yandex_auth(request):
    try:
        logger.info('Получен запрос на авторизацию через Яндекс')
        
        code = request.data.get('code')
        redirect_uri = request.data.get('redirect_uri')

        if not code:
            logger.error('Код авторизации отсутствует')
            return Response(
                {'error': 'Не предоставлен код авторизации'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Добавьте логирование для отладки
        logger.info(f'Обмениваем код {code[:5]}... на токен с redirect_uri: {redirect_uri}')
        
        # Обмениваем код на токен
        token_url = 'https://oauth.yandex.ru/token'
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': settings.YANDEX_CLIENT_ID,
            'client_secret': settings.YANDEX_CLIENT_SECRET,
            'redirect_uri': redirect_uri
        }

        # Отправляем запрос на обмен кода на токен
        token_response = requests.post(token_url, data=token_data)
        
        # Логируем ответ для отладки (только статус)
        logger.info(f'Получен ответ от Яндекс при обмене кода: {token_response.status_code}')
        
        if not token_response.ok:
            logger.error(f'Ошибка получения токена: {token_response.text}')
            return Response(
                {'error': f'Ошибка получения токена: {token_response.text}'}, 
                status=token_response.status_code
            )

        # Извлекаем токен из ответа
        token_json = token_response.json()
        access_token = token_json.get('access_token')

        if not access_token:
            logger.error('Access token отсутствует в ответе')
            return Response(
                {'error': 'Не получен токен доступа'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Получаем информацию о пользователе
        user_info_url = 'https://login.yandex.ru/info'
        headers = {'Authorization': f'OAuth {access_token}'}
        
        logger.info('Запрос информации о пользователе')
        user_info_response = requests.get(user_info_url, headers=headers)
        logger.info(f'Получен ответ с информацией о пользователе: {user_info_response.status_code}')
        logger.debug(f'Информация о пользователе: {user_info_response.text}')

        if not user_info_response.ok:
            logger.error(f'Ошибка получения информации о пользователе: {user_info_response.text}')
            return Response(
                {'error': 'Ошибка получения информации о пользователе'}, 
                status=user_info_response.status_code
            )

        user_info = user_info_response.json()

        # Создаем или получаем существующего пользователя
        logger.info('Создание/обновление пользователя')
        user, created = User.objects.get_or_create(
            username=f"yandex_{user_info['id']}", 
            defaults={
                'email': user_info.get('default_email', ''),
                'first_name': user_info.get('first_name', ''),
                'last_name': user_info.get('last_name', '')
            }
        )
        logger.info(f'Пользователь {"создан" if created else "получен"}')

        # Создаем или обновляем профиль пользователя
        profile, _ = UserProfile.objects.get_or_create(user=user)

        # Обновляем данные Яндекс аккаунта
        yandex_account, _ = YandexAccount.objects.update_or_create(
            yandex_id=user_info['id'],
            defaults={
                'user': user,
                'access_token': access_token,
                'refresh_token': token_json.get('refresh_token'),
                'expires_at': timezone.now() + timedelta(seconds=token_json.get('expires_in', 0))
            }
        )

        # Генерируем JWT токен
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            'token': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'avatarUrl': profile.avatar.url if profile.avatar else None
            }
        }
        
        logger.info('Авторизация успешно завершена')
        return Response(response_data)

    except Exception as e:
        logger.exception('Необработанная ошибка при авторизации через Яндекс')
        return Response(
            {'error': f'Ошибка при авторизации: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['POST'])
@permission_classes([AllowAny])
def create_session(request):
    """Создает временную сессию после авторизации через Яндекс"""
    token = request.data.get('token')
    user_data = request.data.get('user_data')
    
    if not token or not user_data:
        return Response({'error': 'Неполные данные'}, status=400)
    
    # Генерируем одноразовый код для получения сессии
    session_code = str(uuid.uuid4())
    
    # Сохраняем в кэш Redis или другое хранилище
    cache.set(f'session_{session_code}', {
        'token': token,
        'user_data': user_data
    }, timeout=300)  # 5 минут
    
    return Response({'session_code': session_code})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_session(request, session_code):
    """Получает данные сессии по коду и удаляет их из кэша"""
    session_data = cache.get(f'session_{session_code}')
    
    if not session_data:
        return Response({'error': 'Сессия не найдена или истекла'}, status=404)
    
    # Удаляем сессию из кэша (одноразовое использование)
    cache.delete(f'session_{session_code}')
    
    return Response(session_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_library(request):
    """Получение библиотеки пользователя."""
    try:
        library = UserLibrary.objects.filter(user=request.user)
        serializer = UserLibrarySerializer(library, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching user library: {str(e)}")
        return Response(
            {'message': 'Ошибка при получении библиотеки'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_library(request, track_id):
    """Добавление трека в библиотеку пользователя."""
    try:
        track = Track.objects.get(id=track_id)
        # Проверяем, не добавлен ли трек уже
        library_item, created = UserLibrary.objects.get_or_create(user=request.user, track=track)
        
        if created:
            message = 'Трек добавлен в библиотеку'
        else:
            message = 'Трек уже был в библиотеке'
            
        return Response({'message': message})
    except Track.DoesNotExist:
        return Response(
            {'message': 'Трек не найден'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error adding track to library: {str(e)}")
        return Response(
            {'message': 'Ошибка при добавлении трека'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )