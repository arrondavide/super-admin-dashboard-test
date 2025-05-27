import axios from 'axios';
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const permissionService = {
    addPermission: async (userId, pageId, permissionKey) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/permissions/`, 
            {
                user: userId,
                page: pageId,
                permission: permissionKey,
            }, 
            {
                headers: authService.authHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to add permission ${permissionKey} for user ${userId} on page ${pageId}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // Placeholder for revoking permissions - to be detailed if backend DELETE by user/page/key is not available
    // removePermission: async (userId, pageId, permissionKey) => { ... }
    // OR removePermissionById: async (permissionId) => { ... }
};

export default permissionService;
