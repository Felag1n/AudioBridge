from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer,
    TrackSerializer,
    UserLibrarySerializer
)
from .models import Track, UserLibrary
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
def api_root(request):
    return Response({
        'register': reverse('music_api:register', request=request),
        'login': reverse('music_api:login', request=request),
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                },
                'token': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(
            {'message': 'Ошибка валидации', 'errors': serializer.errors}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response(
            {'message': 'Ошибка при регистрации', 'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {'message': 'Пользователь не найден'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            user = authenticate(username=user.username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username,
                    },
                    'token': str(refresh.access_token),
                })
            return Response(
                {'message': 'Неверный пароль'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response(
            {'message': 'Ошибка при входе', 'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_library(request):
    try:
        library = UserLibrary.objects.filter(user=request.user)
        serializer = UserLibrarySerializer(library, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching user library: {str(e)}")
        return Response(
            {'message': 'Ошибка при получении библиотеки'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_library(request, track_id):
    try:
        track = Track.objects.get(id=track_id)
        UserLibrary.objects.create(user=request.user, track=track)
        return Response({'message': 'Трек добавлен в библиотеку'})
    except Track.DoesNotExist:
        return Response(
            {'message': 'Трек не найден'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error adding track to library: {str(e)}")
        return Response(
            {'message': 'Ошибка при добавлении трека'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )