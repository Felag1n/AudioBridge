from rest_framework import serializers
from .models import Track, Comment

class TrackSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = [
            'id', 'title', 'artist', 'album', 'duration',
            'file_path', 'file_url', 'cover_url', 'created_at',
            'user', 'likes_count', 'is_liked'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file_path and hasattr(obj.file_path, 'url'):
            return request.build_absolute_uri(obj.file_path.url)
        return None

    def get_cover_url(self, obj):
        request = self.context.get('request')
        if obj.cover and hasattr(obj.cover, 'url'):
            return request.build_absolute_uri(obj.cover.url)
        return None

# ... rest of the code ... 