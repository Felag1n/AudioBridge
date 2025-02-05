from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('music_api.urls')),  # Все API запросы идут через /api/
    path('', RedirectView.as_view(url='/api/', permanent=True)),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)