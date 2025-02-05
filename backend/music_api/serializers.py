# Импорт необходимых модулей
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Track, UserLibrary, UserProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Сериализатор для регистрации новых пользователей.
    Обрабатывает создание пользователя и его профиля.
    """
    # Пароль только для записи (не будет включен в ответ API)
    password = serializers.CharField(write_only=True)
    # Email обязателен при регистрации
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        """
        Проверяет уникальность email перед регистрацией.
        Raises:
            ValidationError: если email уже используется
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def create(self, validated_data):
        """
        Создает нового пользователя и его профиль.
        Args:
            validated_data: Проверенные данные пользователя
        Returns:
            User: Созданный объект пользователя
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
    Проверяет email и пароль при входе.
    """
    email = serializers.EmailField()
    password = serializers.CharField()

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Сериализатор для профиля пользователя.
    Обрабатывает данные профиля, включая аватар.
    """
    # Добавляем URL аватара как вычисляемое поле
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ('avatar_url',)

    def get_avatar_url(self, obj):
        """
        Формирует полный URL для аватара пользователя.
        Returns:
            str: Полный URL аватара или None, если аватар не установлен
        """
        if obj.avatar:
            return self.context['request'].build_absolute_uri(obj.avatar.url)
        return None

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для обновления данных пользователя.
    Позволяет обновлять основную информацию и аватар.
    """
    # Поле для загрузки аватара (необязательное)
    avatar = serializers.ImageField(required=False)
    # Вложенный сериализатор профиля (только для чтения)
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('username', 'avatar', 'profile')
        
    def update(self, instance, validated_data):
        """
        Обновляет данные пользователя и его профиль.
        Обрабатывает загрузку нового аватара.
        """
        # Извлекаем и обрабатываем аватар отдельно
        avatar = validated_data.pop('avatar', None)
        if avatar:
            # Получаем или создаем профиль пользователя
            profile, created = UserProfile.objects.get_or_create(user=instance)
            profile.avatar = avatar
            profile.save()
        
        # Обновляем остальные поля пользователя
        return super().update(instance, validated_data)

class TrackSerializer(serializers.ModelSerializer):
    """
    Сериализатор для музыкальных треков.
    Обрабатывает все поля модели Track.
    """
    class Meta:
        model = Track
        fields = '__all__'  # Включаем все поля модели

class UserLibrarySerializer(serializers.ModelSerializer):
    """
    Сериализатор для библиотеки пользователя.
    Включает полную информацию о треках в библиотеке.
    """
    # Вложенный сериализатор для получения полной информации о треке
    track = TrackSerializer()

    class Meta:
        model = UserLibrary
        fields = ('id', 'user', 'track', 'added_at')

def get_avatar_url(self, obj):
    if obj.avatar:
        request = self.context.get('request')
        return request.build_absolute_uri(obj.avatar.url)
    return None