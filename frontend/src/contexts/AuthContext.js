import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = authService.getAccessToken();
        const currentUser = authService.getCurrentUser();
        if (token && currentUser) {
            setAccessToken(token);
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const loginContext = async (username, password) => { // Renamed to avoid conflict if imported directly
        try {
            const data = await authService.login(username, password);
            setUser(data.user);
            setAccessToken(data.access);
            return data; 
        } catch (error) {
            throw error;
        }
    };

    const logoutContext = () => { // Renamed
        authService.logout();
        setUser(null);
        setAccessToken(null);
        // Navigation after logout will be handled by components calling logout, or by ProtectedRoute
    };
    
    const isAuthenticated = () => {
        // Check if token is expired here later if you have token expiration logic
        return !!accessToken && !!user;
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login: loginContext, logout: logoutContext, loading }}>
            {!loading && children} {/* Render children only after initial loading is done */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
