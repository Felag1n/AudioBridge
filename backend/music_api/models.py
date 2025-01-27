from django.db import models
from django.contrib.auth.models import User

class Track(models.Model):
    yandex_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200, null=True, blank=True)
    album = models.CharField(max_length=200, null=True, blank=True)
    cover_url = models.URLField(null=True, blank=True)
    genre = models.CharField(max_length=100, null=True, blank=True)
    audio_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.artist}"

class UserLibrary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "User libraries"

    def __str__(self):
        return f"{self.user.username} - {self.track.title}"