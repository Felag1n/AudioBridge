from django.contrib import admin
from .models import Track, UserLibrary

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'genre')
    search_fields = ('title', 'artist', 'album')
    list_filter = ('genre',)

@admin.register(UserLibrary)
class UserLibraryAdmin(admin.ModelAdmin):
    list_display = ('user', 'track', 'added_at')
    list_filter = ('user', 'added_at')