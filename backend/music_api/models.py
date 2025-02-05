# music_api/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
def user_avatar_path(instance, filename):
    return f'avatars/user_{instance.user.id}/{filename}'

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to=user_avatar_path, blank=True, null=True)
    
    def __str__(self):
        return self.user.username

class Track(models.Model):
    title = models.CharField(max_length=200, verbose_name="Название")
    artist = models.CharField(max_length=200, verbose_name="Исполнитель")
    album = models.CharField(max_length=200, verbose_name="Альбом", blank=True, null=True)
    duration = models.IntegerField(verbose_name="Длительность (сек)", default=0)
    file_path = models.CharField(max_length=500, verbose_name="Путь к файлу", default='', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Трек"
        verbose_name_plural = "Треки"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.artist} - {self.title}"

class UserLibrary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='library')
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Библиотека пользователя"
        verbose_name_plural = "Библиотеки пользователей"
        ordering = ['-added_at']
        unique_together = ('user', 'track')

    def __str__(self):
        return f"{self.user.username} - {self.track.title}"
    
class YandexAccount(models.Model):
    """
    Модель для хранения данных аккаунта Яндекс
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    yandex_id = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255, null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Яндекс аккаунт пользователя {self.user.username}"

    class Meta:
        verbose_name = "Яндекс аккаунт"
        verbose_name_plural = "Яндекс аккаунты"



class YandexAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    yandex_id = models.CharField(max_length=50, unique=True)
    access_token = models.TextField()
    refresh_token = models.TextField(null=True, blank=True)  # Делаем поле опциональным
    expires_at = models.DateTimeField()

    def is_token_expired(self):
        return timezone.now() >= self.expires_at

    def refresh_token(self):
        # Здесь будет логика обновления токена
        pass