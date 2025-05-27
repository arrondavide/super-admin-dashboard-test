from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom User model with super admin functionality"""
    is_super_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({'Super Admin' if self.is_super_admin else 'User'})"

class Page(models.Model):
    """Represents the 10 predefined pages in the system"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class UserPermission(models.Model):
    """User permissions for specific pages"""
    PERMISSION_CHOICES = [
        ('view', 'View'),
        ('edit', 'Edit'),
        ('create', 'Create'),
        ('delete', 'Delete'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='permissions')
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='user_permissions')
    permission = models.CharField(max_length=10, choices=PERMISSION_CHOICES)
    granted_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='granted_permissions',
        help_text="Super admin who granted this permission"
    )
    granted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Prevent duplicate permissions for same user/page/permission combination
        unique_together = ('user', 'page', 'permission')
    
    def __str__(self):
        return f"{self.user.username} - {self.page.name} - {self.permission}"