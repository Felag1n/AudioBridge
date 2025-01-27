from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Track, UserLibrary
import requests

class TrackViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Track.objects.all()
    serializer_class = TrackSerializer

@api_view(['POST'])
def search_yandex_music(request):
    query = request.data.get('query')
    # Здесь будет код для работы с API Яндекс.Музыки
    # Нужно будет добавить авторизацию через OAuth
    pass