# Импорт необходимых модулей
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Track, UserLibrary, UserProfile


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
    
    class Meta:
        model = Track
        fields = ('id', 'title', 'artist', 'album', 'duration', 'file_path', 'file_url', 'created_at')
    
    def get_file_url(self, obj):
        """
        Формирует полный URL для аудио файла, если он доступен.
        """
        if obj.file_path:
            request = self.context.get('request')
            if request and not obj.file_path.startswith(('http://', 'https://')):
                return request.build_absolute_uri(obj.file_path)
            return obj.file_path
        return None


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