from django.urls import path
from . import views

urlpatterns = [
    # Comments for specific pages
    path('<str:page_slug>/', views.CommentListCreateView.as_view(), name='comment_list_create'),
    path('detail/<int:pk>/', views.CommentDetailView.as_view(), name='comment_detail'),
    path('history/<int:comment_id>/', views.comment_history_view, name='comment_history'),
]