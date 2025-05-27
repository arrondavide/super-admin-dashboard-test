import axios from 'axios';
import authService from './authService'; // For authHeader

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const commentService = {
    getCommentsByPageSlug: async (pageSlug) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/comments/${pageSlug}/`, {
                headers: authService.authHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch comments for page ${pageSlug}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    },

    addComment: async (pageSlug, content) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/comments/${pageSlug}/`, 
            { content }, 
            {
                headers: authService.authHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to add comment for page ${pageSlug}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    },
    
    // updateComment: async (commentId, content) => { ... } // For Part 2
    // deleteComment: async (commentId) => { ... } // For Part 2
    updateComment: async (commentId, content) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/comments/detail/${commentId}/`, 
            { content }, 
            {
                headers: authService.authHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to update comment ${commentId}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    },

    deleteComment: async (commentId) => {
        try {
            await axios.delete(`${API_BASE_URL}/comments/detail/${commentId}/`, {
                headers: authService.authHeader(),
            });
        } catch (error) {
            console.error(`Failed to delete comment ${commentId}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getCommentHistory: async (commentId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/comments/history/${commentId}/`, {
                headers: authService.authHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch history for comment ${commentId}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    },
};

export default commentService;
