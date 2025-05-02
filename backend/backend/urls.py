from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from music_api import views  # Добавить эту строку

urlpatterns = [
    # Admin URL at root level
    path('admin/', admin.site.urls),
    
    # API URLs
    path('api/', include('music_api.urls')),  # Все API запросы идут через /api/
    
    # Redirect root to API
    path('', RedirectView.as_view(url='/api/', permanent=True)),
]

# Добавляем обработку медиафайлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)