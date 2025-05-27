from rest_framework import serializers
from .models import Comment, CommentHistory
from users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'page_slug', 'content', 'author', 'created_at', 'updated_at', 'is_edited']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'is_edited']

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['page_slug', 'content']

class CommentHistorySerializer(serializers.ModelSerializer):
    modified_by = UserSerializer(read_only=True)
    
    class Meta:
        model = CommentHistory
        fields = ['id', 'old_content', 'modified_by', 'modified_at']