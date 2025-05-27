import axios from 'axios';

// Define the base URL for your Django backend. 
// It's good practice to put this in an environment variable later.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
                username,
                password,
            });
            if (response.data.access) {
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
                // The backend login endpoint returns the user object too
                localStorage.setItem('user', JSON.stringify(response.data.user)); 
            }
            return response.data; // Contains tokens and user object
        } catch (error) {
            // Handle or throw error to be caught by the calling component
            console.error('Login failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    logout: () => {
        // Optionally, you could also call a backend logout endpoint if it invalidates the refresh token
        // For example: await axios.post(`${API_BASE_URL}/auth/logout/`, { refresh: localStorage.getItem('refreshToken') }, { headers: authHeader() });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    getAccessToken: () => {
        return localStorage.getItem('accessToken');
    },

    getRefreshToken: () => {
        return localStorage.getItem('refreshToken');
    },

    // Helper function to get authorization header
    authHeader: () => {
        const token = authService.getAccessToken();
        if (token) {
            return { Authorization: 'Bearer ' + token };
        } else {
            return {};
        }
    },
    
    // Optional: Add a function to refresh the access token later if needed
    // refreshToken: async () => { ... }
};

export default authService;
