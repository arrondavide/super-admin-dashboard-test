import axios from 'axios';
import authService from './authService'; // For getting the auth header

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const pageService = {
    getAllPages: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pages/`, {
                headers: authService.authHeader(), // Requires authentication
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch pages:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    // Add other page-related API call functions here later if needed (e.g., getPageDetails, createPage)
};

export default pageService;
