from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Comment(models.Model):
    """Comments for each page in the system"""
    page_slug = models.CharField(max_length=100, help_text="Which page this comment belongs to")
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_edited = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']  # Newest comments first
    
    def __str__(self):
        return f"{self.author.username} on {self.page_slug}: {self.content[:50]}..."
    
    def save(self, *args, **kwargs):
        # Track if this is an edit (not initial creation)
        if self.pk:  # If comment already exists (updating)
            old_comment = Comment.objects.get(pk=self.pk)
            if old_comment.content != self.content:
                # Content changed, mark as edited and save history
                self.is_edited = True
                # Create history record
                CommentHistory.objects.create(
                    comment=self,
                    old_content=old_comment.content,
                    modified_by=kwargs.get('modified_by', self.author)
                )
        super().save(*args, **kwargs)

class CommentHistory(models.Model):
    """Track modification history of comments"""
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='history')
    old_content = models.TextField()
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE)
    modified_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-modified_at']
        verbose_name_plural = "Comment histories"
    
    def __str__(self):
        return f"History for comment {self.comment.id} by {self.modified_by.username}"