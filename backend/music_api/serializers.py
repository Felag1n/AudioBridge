# Импорт необходимых модулей
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Track, UserLibrary, UserProfile, Comment
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Сериализатор для регистрации новых пользователей.
    Обрабатывает создание пользователя и его профиля.
    """
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        """
        Проверяет уникальность email перед регистрацией.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def create(self, validated_data):
        """
        Создает нового пользователя и его профиль.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Создаем профиль пользователя
        UserProfile.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Сериализатор для аутентификации пользователя.
    """
    email = serializers.EmailField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Сериализатор для профиля пользователя.
    """
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ('avatar_url',)

    def get_avatar_url(self, obj):
        """
        Формирует полный URL для аватара пользователя.
        """
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для обновления данных пользователя.
    """
    avatar = serializers.ImageField(required=False, write_only=True)
    profile = UserProfileSerializer(read_only=True, source='userprofile')

    class Meta:
        model = User
        fields = ('username', 'email', 'avatar', 'profile')
        extra_kwargs = {
            'email': {'required': False},
        }
        
    def update(self, instance, validated_data):
        """
        Обновляет данные пользователя и его профиль.
        """
        # Извлекаем аватар из данных
        avatar = validated_data.pop('avatar', None)
        
        # Обновляем основные поля пользователя
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Если предоставлен новый аватар, обновляем его
        if avatar:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            profile.avatar = avatar
            profile.save()
        
        return instance


class TrackSerializer(serializers.ModelSerializer):
    """
    Сериализатор для музыкальных треков.
    """
    file_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Track
        fields = ('id', 'title', 'artist', 'album', 'duration', 'file_path', 'file_url', 'cover', 'cover_url', 'created_at', 'user')
        read_only_fields = ('user',)
    
    def get_file_url(self, obj):
        """
        Формирует полный URL для аудио файла.
        """
        if obj.file_path:
            request = self.context.get('request')
            if request:
                # Используем абсолютный URL для медиафайлов
                url = request.build_absolute_uri(obj.file_path.url)
                logger.info(f"Generated file URL: {url}")
                return url
            
            # Если нет request, формируем URL вручную
            file_path = str(obj.file_path)
            if file_path.startswith('/'):
                file_path = file_path[1:]
            url = f"http://localhost:8000/media/{file_path}"
            logger.info(f"Using manual file URL: {url}")
            return url
            
        logger.warning("No file_path found for track")
        return None

    def get_cover_url(self, obj):
        """
        Формирует полный URL для обложки трека.
        """
        if obj.cover:
            request = self.context.get('request')
            if request:
                # Используем абсолютный URL для медиафайлов
                url = request.build_absolute_uri(obj.cover.url)
                logger.info(f"Generated cover URL: {url}")
                return url
            
            # Если нет request, формируем URL вручную
            cover_path = str(obj.cover)
            if cover_path.startswith('/'):
                cover_path = cover_path[1:]
            url = f"http://localhost:8000/media/{cover_path}"
            logger.info(f"Using manual cover URL: {url}")
            return url
            
        logger.warning("No cover found for track")
        return None

    def to_representation(self, instance):
        """
        Преобразует объект в словарь для сериализации.
        """
        data = super().to_representation(instance)
        logger.info(f"Serialized data before removing fields: {data}")
        # Удаляем только поле cover, так как оно содержит только путь к файлу
        data.pop('cover', None)
        logger.info(f"Serialized data after removing fields: {data}")
        return data


class UserLibrarySerializer(serializers.ModelSerializer):
    """
    Сериализатор для библиотеки пользователя.
    """
    track = TrackSerializer()

    class Meta:
        model = UserLibrary
        fields = ('id', 'user', 'track', 'added_at')
        
    def to_representation(self, instance):
        """
        Дополнительно обрабатывает представление объекта библиотеки.
        """
        representation = super().to_representation(instance)
        # Можно добавить дополнительную логику обработки
        return representation


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    text = serializers.CharField(source='content', write_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'text', 'content', 'created_at', 'user')
        read_only_fields = ('user', 'content')

    def get_user(self, obj):
        user = obj.user
        profile = user.profile
        return {
            'id': user.id,
            'username': user.username,
            'avatar_url': self.context['request'].build_absolute_uri(profile.avatar.url) if profile.avatar else None
        }