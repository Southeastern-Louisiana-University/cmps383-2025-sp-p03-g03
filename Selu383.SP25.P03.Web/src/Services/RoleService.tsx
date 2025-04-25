import axios from 'axios';
import { logger } from './LoggerForServices';

// Base API URL
const API_URL = '/api/Roles';

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string): never => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with an error status
            logger.error(
                `${context} failed with status ${error.response.status}`,
                error
            );
        } else if (error.request) {
            // Request was made but no response
            logger.error(
                `${context} failed - no response received from server`,
                error
            );
        } else {
            // Error in setting up the request
            logger.error(
                `${context} failed - request setup error`,
                error
            );
        }
    } else {
        // Non-Axios error
        logger.error(
            `${context} failed with non-axios error`,
            error
        );
    }
    throw error;
};

// Role service methods
export const RoleService = {
    // Get all roles
    getRoles: async (): Promise<string[]> => {
        try {
            logger.info(`Fetching all roles from ${API_URL}`);

            // Add timestamp to URL to prevent caching issues
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${API_URL}${cacheBuster}`;

            const response = await axios.get<string[]>(url);

            // Log response details
            logger.success(`Retrieved ${response.data.length} roles`);
            if (response.data.length === 0) {
                logger.warn('No roles returned from API');
            }

            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all roles');
        }
    },

    // Create a new role
    createRole: async (name: string): Promise<void> => {
        try {
            logger.info(`Creating new role: ${name}`);
            await axios.post(API_URL, { name });
            logger.success(`Role ${name} created successfully`);
        } catch (error) {
            handleApiError(error, `Creating role ${name}`);
        }
    },

    // Update a role
    updateRole: async (oldName: string, newName: string): Promise<void> => {
        try {
            logger.info(`Updating role from ${oldName} to ${newName}`);
            await axios.put(`${API_URL}/${encodeURIComponent(oldName)}`, { name: newName });
            logger.success(`Role ${oldName} updated to ${newName} successfully`);
        } catch (error) {
            handleApiError(error, `Updating role ${oldName}`);
        }
    },

    // Delete a role
    deleteRole: async (name: string): Promise<void> => {
        try {
            logger.info(`Deleting role ${name}`);
            await axios.delete(`${API_URL}/${encodeURIComponent(name)}`);
            logger.success(`Role ${name} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting role ${name}`);
        }
    },

    // Assign role to a user
    assignRoleToUser: async (userId: number, roleName: string): Promise<void> => {
        try {
            logger.info(`Assigning role ${roleName} to user ${userId}`);
            await axios.post(`${API_URL}/assign`, { userId, roleName });
            logger.success(`Role ${roleName} assigned to user ${userId} successfully`);
        } catch (error) {
            handleApiError(error, `Assigning role ${roleName} to user ${userId}`);
        }
    },

    // Remove role from a user
    removeRoleFromUser: async (userId: number, roleName: string): Promise<void> => {
        try {
            logger.info(`Removing role ${roleName} from user ${userId}`);
            await axios.post(`${API_URL}/remove`, { userId, roleName });
            logger.success(`Role ${roleName} removed from user ${userId} successfully`);
        } catch (error) {
            handleApiError(error, `Removing role ${roleName} from user ${userId}`);
        }
    }
};