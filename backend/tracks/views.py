from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Track
from .serializers import TrackSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_track(request, track_id):
    """Добавление трека в избранное"""
    try:
        track = Track.objects.get(id=track_id)
        track.likes.add(request.user)
        return Response({
            'status': 'success',
            'likes_count': track.likes.count(),
            'is_liked': True
        })
    except Track.DoesNotExist:
        return Response({'error': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unlike_track(request, track_id):
    """Удаление трека из избранного"""
    try:
        track = Track.objects.get(id=track_id)
        track.likes.remove(request.user)
        return Response({
            'status': 'success',
            'likes_count': track.likes.count(),
            'is_liked': False
        })
    except Track.DoesNotExist:
        return Response({'error': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)

# ... rest of the code ... 