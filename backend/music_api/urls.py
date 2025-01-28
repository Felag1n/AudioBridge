from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
app_name = 'music_api'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('library/', views.get_user_library, name='user-library'),
    path('library/add/<int:track_id>/', views.add_to_library, name='add-to-library'),
    path('', views.api_root, name='api-root'),
     path('profile/', views.update_profile, name='update-profile'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)