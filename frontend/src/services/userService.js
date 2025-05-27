import axios from 'axios';
import authService from './authService'; // For getting the auth header

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const userService = {
    getAllUsers: async () => {
        try {
            // This endpoint should be protected by IsOnlySuperAdmin on the backend
            const response = await axios.get(`${API_BASE_URL}/users/`, {
                headers: authService.authHeader(), 
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch users:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    // Add other user-related API call functions here later (e.g., createUser, updateUser, deleteUser)
    getUserRoleTableData: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user-role-table/`, {
                headers: authService.authHeader(),
            });
            return response.data; // Expected: { users: [...], pages: [...] }
        } catch (error) {
            console.error('Failed to fetch user-role table data:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
};

export default userService;
