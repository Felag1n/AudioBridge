# music_api/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Track, UserLibrary, UserProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Создаем профиль пользователя
        UserProfile.objects.create(user=user)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ('avatar_url',)

    def get_avatar_url(self, obj):
        if obj.avatar:
            return self.context['request'].build_absolute_uri(obj.avatar.url)
        return None

class UserUpdateSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('username', 'avatar', 'profile')
        
    def update(self, instance, validated_data):
        avatar = validated_data.pop('avatar', None)
        if avatar:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            profile.avatar = avatar
            profile.save()
        
        return super().update(instance, validated_data)

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = '__all__'

class UserLibrarySerializer(serializers.ModelSerializer):
    track = TrackSerializer()

    class Meta:
        model = UserLibrary
        fields = ('id', 'user', 'track', 'added_at')