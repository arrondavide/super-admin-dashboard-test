from rest_framework import generics, permissions, status
from rest_framework import serializers # Added for serializers.ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Comment, CommentHistory
from .serializers import CommentSerializer, CommentCreateSerializer, CommentHistorySerializer
from .permissions import IsAuthorOrSuperAdmin # New permission class
from users.models import Page # To verify page exists for a comment

class CommentListCreateView(generics.ListCreateAPIView):
    """
    List all comments for a given page_slug, or create a new comment.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer
        return CommentSerializer

    def get_queryset(self):
        page_slug = self.kwargs.get('page_slug')
        # Optional: Check if page_slug actually corresponds to a Page object
        # get_object_or_404(Page, slug=page_slug) 
        return Comment.objects.filter(page_slug=page_slug).order_by('-created_at')

    def perform_create(self, serializer):
        page_slug = self.kwargs.get('page_slug')
        # Ensure the page exists before creating a comment for it
        # You might want to customize this error response
        if not Page.objects.filter(slug=page_slug).exists():
            # This case should ideally be handled by the serializer or caught earlier
            # For now, raising a validation error or returning a specific response
            raise serializers.ValidationError({"page_slug": "Page not found."}) # Import serializers from rest_framework

        serializer.save(author=self.request.user, page_slug=page_slug)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a comment instance.
    Only author or super admin can edit/delete.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrSuperAdmin]

    def perform_update(self, serializer):
        # The custom save() method in Comment model handles CommentHistory.
        # We need to ensure 'modified_by' is passed if logic requires it,
        # but the model's save method defaults to self.author if not provided.
        # If super_admin edits, the model's save method needs to receive that info.
        
        # Check if content is actually being changed
        instance = serializer.instance
        if 'content' in serializer.validated_data and instance.content != serializer.validated_data['content']:
             # Pass the current user as modified_by.
             # The model's save method will create a history record.
            serializer.save(modified_by=self.request.user)
        else:
            # If content is not changed, just save without creating a history entry
            # or passing modified_by, unless other fields are changing.
            serializer.save()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def comment_history_view(request, comment_id):
    """
    Retrieve the modification history for a specific comment.
    """
    # Ensure the user has permission to view the comment itself, or is super_admin
    # This part depends on how strict the access to history should be.
    # For now, just checking if the comment exists.
    comment = get_object_or_404(Comment, pk=comment_id)
    
    # Example: Check if user can access the comment (author or super_admin or has page view perm)
    # if not (comment.author == request.user or request.user.is_super_admin):
    #     # Or more complex logic: check if user has 'view' permission for comment.page_slug
    #     return Response({"detail": "Not authorized to view this comment's history."}, status=status.HTTP_403_FORBIDDEN)

    history = CommentHistory.objects.filter(comment_id=comment_id).order_by('-modified_at')
    if not history.exists():
        return Response([], status=status.HTTP_200_OK) # Return empty list if no history
        
    serializer = CommentHistorySerializer(history, many=True)
    return Response(serializer.data)
