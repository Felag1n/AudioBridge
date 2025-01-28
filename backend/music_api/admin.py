from django.contrib import admin
from .models import Track, UserLibrary

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'duration')  # Убрали genre
    search_fields = ('title', 'artist', 'album')
    list_filter = ('created_at',)  # Заменили genre на created_at

@admin.register(UserLibrary)
class UserLibraryAdmin(admin.ModelAdmin):
    list_display = ('user', 'track', 'added_at')
    list_filter = ('user', 'added_at')
    search_fields = ('user__username', 'track__title')