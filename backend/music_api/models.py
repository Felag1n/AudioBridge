# music_api/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
def user_avatar_path(instance, filename):
    return f'avatars/user_{instance.user.id}/{filename}'

def track_file_path(instance, filename):
    return f'tracks/user_{instance.user.id}/{filename}'

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
    file_path = models.FileField(upload_to=track_file_path, verbose_name="Аудио файл")
    cover = models.ImageField(upload_to='track_covers/', verbose_name="Обложка", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tracks', null=True, blank=True)
    likes = models.ManyToManyField(User, related_name='liked_tracks', blank=True)
    
    def __str__(self):
        return f"{self.artist} - {self.title}"
    
    class Meta:
        verbose_name = "Трек"
        verbose_name_plural = "Треки"

class Comment(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Комментарий от {self.user.username} к треку {self.track.title}"
    
    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"
        ordering = ['-created_at']

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
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    yandex_id = models.CharField(max_length=255, unique=True)
    access_token = models.TextField()  # Using TextField for potentially long tokens
    refresh_token = models.TextField(null=True, blank=True)  # Optional field
    expires_at = models.DateTimeField(null=True, blank=True)
    
    def is_token_expired(self):
        return timezone.now() >= self.expires_at
    
    def __str__(self):
        return f"Яндекс аккаунт пользователя {self.user.username}"

    class Meta:
        verbose_name = "Яндекс аккаунт"
        verbose_name_plural = "Яндекс аккаунты"