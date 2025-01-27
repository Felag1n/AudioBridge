from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('music_api.urls')),
    # Перенаправляем корневой URL на api/
    path('', RedirectView.as_view(url='/api/', permanent=True)),
]