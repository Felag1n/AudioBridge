# Импорт необходимых функций и настроек Django
from django.urls import path  # Функция для создания URL-маршрутов
from django.conf import settings  # Настройки проекта
from django.conf.urls.static import static  # Функция для обработки статических файлов
from . import views  # Импорт представлений из текущего приложения

# Определение пространства имен для приложения
app_name = 'music_api'

# Список URL-маршрутов приложения
urlpatterns = [
    # Маршрут для регистрации новых пользователей
    path('register/', views.register, name='register'),
    
    # Маршрут для входа в систему
    path('login/', views.login, name='login'),
    
    # Маршрут для получения библиотеки пользователя
    path('library/', views.get_user_library, name='user-library'),
    
    # Маршрут для добавления трека в библиотеку
    # <int:track_id> - параметр URL, принимающий целое число (ID трека)
    path('library/add/<int:track_id>/', views.add_to_library, name='add-to-library'),
    
    # Корневой маршрут API, отображает список доступных endpoint'ов
    path('', views.api_root, name='api-root'),
    
    # Маршрут для обновления профиля пользователя
    path('profile/', views.update_profile, name='update-profile'),

     # Добавляем новый URL для Яндекс OAuth
    path('auth/yandex/', views.yandex_auth, name='yandex-auth'),

    path('yandex/tracks/<str:track_id>/', views.get_yandex_track, name='yandex-track'),  # изменено с get_track на get_yandex_track
    path('yandex/tracks/search/', views.search_yandex_tracks, name='yandex-search'),
    path('yandex/tracks/popular/', views.get_yandex_popular_tracks, name='yandex-popular'),

# Добавление обработки медиафайлов в режиме разработки
# settings.MEDIA_URL - URL-префикс для медиафайлов
# settings.MEDIA_ROOT - путь к директории с медиафайлами
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)