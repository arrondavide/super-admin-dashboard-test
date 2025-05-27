from django.contrib import admin
from .models import Comment, CommentHistory

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'page_slug', 'content_preview', 'created_at', 'updated_at', 'is_edited')
    list_filter = ('is_edited', 'page_slug', 'created_at')
    search_fields = ('author__username', 'page_slug', 'content')
    autocomplete_fields = ['author']

    def content_preview(self, obj):
        return (obj.content[:50] + '...') if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'

@admin.register(CommentHistory)
class CommentHistoryAdmin(admin.ModelAdmin):
    list_display = ('comment_id_display', 'modified_by', 'modified_at', 'old_content_preview')
    list_filter = ('modified_at',)
    search_fields = ('comment__id', 'modified_by__username', 'old_content')
    autocomplete_fields = ['comment', 'modified_by']

    def comment_id_display(self, obj):
        return obj.comment.id
    comment_id_display.short_description = 'Comment ID'
    
    def old_content_preview(self, obj):
        return (obj.old_content[:50] + '...') if len(obj.old_content) > 50 else obj.old_content
    old_content_preview.short_description = 'Old Content Preview'
