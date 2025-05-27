import React from 'react';
import { Navigate } from 'react-router-dom';

const HomePage = () => {
    // This page could eventually have logic to redirect based on auth status/role
    // For now, let's imagine it redirects to login if not authenticated,
    // or to a default page if authenticated.
    // Simple redirect to /login for now:
    return <Navigate to="/login" replace />;
};

export default HomePage;
