from rest_framework import permissions

class IsAuthorOrSuperAdmin(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object or super admins to edit/delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the comment
        # or a super admin.
        return obj.author == request.user or request.user.is_super_admin
