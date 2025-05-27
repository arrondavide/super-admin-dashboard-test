from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/me/', views.current_user_view, name='current_user'),
    
    # User management (Super Admin only)
    path('users/', views.UserListCreateView.as_view(), name='user_list_create'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
    
    # Pages
    path('pages/', views.PageListView.as_view(), name='page_list'),
    
    # Permissions
    path('permissions/', views.UserPermissionListView.as_view(), name='permission_list_create'),
    path('my-permissions/', views.user_permissions_view, name='my_permissions'),
    path('user-role-table/', views.user_role_table_view, name='user_role_table'),
]