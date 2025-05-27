from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Page, UserPermission

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_super_admin', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                    return data
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Invalid username or password.')
        else:
            raise serializers.ValidationError('Must provide username and password.')

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'name', 'slug', 'description']

class UserPermissionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    page = PageSerializer(read_only=True)
    
    class Meta:
        model = UserPermission
        fields = ['id', 'user', 'page', 'permission', 'granted_at']

class UserPermissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPermission
        fields = ['user', 'page', 'permission']