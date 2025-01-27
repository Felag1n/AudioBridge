from django.urls import path
from . import views

app_name = 'music_api'

urlpatterns = [
    # Аутентификация
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    # Добавим корневой маршрут для API
    path('', views.api_root, name='api-root'),
]