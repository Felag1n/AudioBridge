# Импорт необходимых функций и настроек Django
from django.urls import path  # Функция для создания URL-маршрутов
from django.conf import settings  # Настройки проекта
from django.conf.urls.static import static  # Функция для обработки статических файлов
from . import views  # Импорт представлений из текущего приложения

# Определение пространства имен для приложения
app_name = 'music_api'

# Список URL-маршрутов приложения
urlpatterns = [
    # Root API endpoint
    path('', views.api_root, name='api-root'),
    
    # Auth endpoints
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('verify/', views.verify_auth, name='verify-auth'),
    path('auth/yandex/', views.yandex_auth, name='yandex-auth'),
    
    # Track endpoints
    path('tracks/', views.get_tracks, name='track-list'),
    path('tracks/upload/', views.upload_track, name='upload-track'),
    path('tracks/<int:track_id>/', views.get_track, name='track-detail'),
    path('tracks/<int:track_id>/like/', views.like_track, name='like-track'),
    path('tracks/<int:track_id>/unlike/', views.unlike_track, name='unlike-track'),
    path('tracks/<int:track_id>/delete/', views.delete_track, name='delete-track'),
    path('tracks/recent/', views.get_recent_tracks, name='recent-tracks'),
    path('tracks/popular/', views.get_popular_tracks, name='popular-tracks'),
    path('tracks/user/', views.get_user_tracks, name='user_tracks'),
    
    # Comment endpoints
    path('tracks/<int:track_id>/comments/', views.track_comments, name='track-comments'),
    path('tracks/<int:track_id>/comments/<int:comment_id>/', views.delete_comment, name='delete-comment'),
    
    # Profile endpoints
    path('profile/', views.update_profile, name='profile'),
    path('profile/<int:user_id>/', views.user_profile, name='user-profile'),
    
    # Library endpoints
    path('library/', views.get_user_library, name='user-library'),
    path('library/add/<int:track_id>/', views.add_to_library, name='add-to-library'),
    
    # Yandex endpoints
    path('yandex/tracks/<str:track_id>/', views.get_yandex_track, name='yandex-track'),
    path('yandex/tracks/search/', views.search_yandex_tracks, name='yandex-search'),
    path('yandex/tracks/popular/', views.get_yandex_popular_tracks, name='yandex-popular'),
    
    # Album endpoints
    path('albums/user/', views.get_user_albums, name='user_albums'),
    path('albums/popular/', views.get_popular_albums, name='popular-albums'),
    
    # Utility endpoints
    path('placeholder/<int:width>/<int:height>/', views.placeholder_image, name='placeholder'),
]

# Добавляем обработку медиафайлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)