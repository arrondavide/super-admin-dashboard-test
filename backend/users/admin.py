from django.contrib import admin
from .models import User, Page, UserPermission

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_super_admin', 'is_staff', 'is_active')
    list_filter = ('is_super_admin', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)} # Optional: helps create slugs

@admin.register(UserPermission)
class UserPermissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'page', 'permission', 'granted_by', 'granted_at')
    list_filter = ('permission', 'page')
    search_fields = ('user__username', 'page__name')
    autocomplete_fields = ['user', 'page', 'granted_by'] # Improves usability
