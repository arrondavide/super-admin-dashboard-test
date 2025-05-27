import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as necessary

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // You might want to show a loading spinner here
        return <div>Loading...</div>;
    }

    if (!isAuthenticated()) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to so we can send them along after they login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If allowedRoles is provided, check if the user's role is allowed
    // For now, our 'user' object from backend has 'is_super_admin' (boolean)
    // We can adapt this to a more generic roles array if needed later.
    if (allowedRoles) {
        const isSuperAdmin = user?.is_super_admin;
        if (allowedRoles.includes('super_admin') && !isSuperAdmin) {
            // User is not a super admin, but route requires it
            return <Navigate to="/unauthorized" replace />; // Or a generic "Access Denied" page
        }
        if (allowedRoles.includes('user') && isSuperAdmin) {
            // Example: if a route is only for non-superadmin users.
            // This logic might need refinement based on specific page access rules.
        }
    }
    
    // If authenticated and (no specific roles required OR user has required role), render the child component
    return <Outlet />; // Renders the nested route/component
};

export default ProtectedRoute;
