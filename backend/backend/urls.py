from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from music_api import views  # Добавить эту строку

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('music_api.urls')),  # Все API запросы идут через /api/
    path('api/auth/login/', views.login, name='auth-login'),  # Теперь views определено
    path('', RedirectView.as_view(url='/api/', permanent=True)),
]

# Добавляем обработку медиафайлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)