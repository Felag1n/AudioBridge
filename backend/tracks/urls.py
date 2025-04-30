from django.urls import path
from . import views

urlpatterns = [
    path('', views.TrackListCreateView.as_view(), name='track-list-create'),
    path('<int:pk>/', views.TrackDetailView.as_view(), name='track-detail'),
    path('<int:track_id>/comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('<int:track_id>/like/', views.like_track, name='like-track'),
    path('<int:track_id>/unlike/', views.unlike_track, name='unlike-track'),
] 