from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Page, UserPermission
from .serializers import (
    UserSerializer, UserCreateSerializer, LoginSerializer, 
    PageSerializer, UserPermissionSerializer, UserPermissionCreateSerializer
)

class IsOnlySuperAdmin(permissions.BasePermission):
    """Custom permission class for super admin only"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_super_admin

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """Login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Logout endpoint"""
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user_view(request):
    """Get current user info"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class UserListCreateView(generics.ListCreateAPIView):
    """List all users and create new users (Super Admin only)"""
    queryset = User.objects.all()
    permission_classes = [IsOnlySuperAdmin]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserCreateSerializer
        return UserSerializer

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update or delete a specific user (Super Admin only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOnlySuperAdmin]

class PageListView(generics.ListAPIView):
    """List all pages"""
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserPermissionListView(generics.ListCreateAPIView):
    """List and create user permissions (Super Admin only)"""
    queryset = UserPermission.objects.all()
    permission_classes = [IsOnlySuperAdmin]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserPermissionCreateSerializer
        return UserPermissionSerializer
    
    def perform_create(self, serializer):
        serializer.save(granted_by=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_permissions_view(request):
    """Get current user's permissions"""
    permissions = UserPermission.objects.filter(user=request.user)
    serializer = UserPermissionSerializer(permissions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsOnlySuperAdmin])
def user_role_table_view(request):
    """Get user-role table data for admin dashboard"""
    users = User.objects.filter(is_super_admin=False)
    pages = Page.objects.all()
    
    data = []
    for user in users:
        user_data = {
            'user': UserSerializer(user).data,
            'permissions': {}
        }
        
        # Get all permissions for this user
        user_permissions = UserPermission.objects.filter(user=user)
        
        for page in pages:
            page_permissions = user_permissions.filter(page=page)
            user_data['permissions'][page.slug] = [p.permission for p in page_permissions]
        
        data.append(user_data)
    
    return Response({
        'users': data,
        'pages': PageSerializer(pages, many=True).data
    })