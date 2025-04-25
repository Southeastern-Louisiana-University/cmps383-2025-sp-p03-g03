import axios from 'axios';
import { logger } from './LoggerForServices';

// TypeScript interfaces
export interface UserDTO {
    id: number;
    userName: string;
    roles?: string[];
}

export interface CreateUserDTO {
    username: string;
    password: string;
    roles?: string[];
}

// Base API URL
const API_URL = '/api/users';

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

// User service methods
export const UserManagementService = {
    // Get all users
    getAll: async (): Promise<UserDTO[]> => {
        try {
            logger.info(`Fetching all users from ${API_URL}`);

            // Add timestamp to URL to prevent caching issues
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${API_URL}${cacheBuster}`;

            const response = await axios.get<UserDTO[]>(url);

            // Log response details
            logger.success(`Retrieved ${response.data.length} users`);
            if (response.data.length === 0) {
                logger.warn('No users returned from API');
            } else {
                logger.info('First few users:', response.data.slice(0, 3));
            }

            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all users');
        }
    },

    // Get a single user by ID
    getById: async (id: number): Promise<UserDTO> => {
        try {
            logger.info(`Fetching user with ID ${id}`);
            const response = await axios.get<UserDTO>(`${API_URL}/${id}`);
            logger.success(`Retrieved user ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching user with ID ${id}`);
        }
    },

    // Create a new user
    create: async (user: CreateUserDTO): Promise<UserDTO> => {
        try {
            logger.info('Creating new user', user);
            const response = await axios.post<UserDTO>(API_URL, user);
            logger.success('User created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new user');
        }
    },

    // Update an existing user's roles
    updateRoles: async (id: number, roles: string[]): Promise<UserDTO> => {
        try {
            logger.info(`Updating user ${id} roles`, roles);
            const response = await axios.put<UserDTO>(`${API_URL}/${id}/roles`, roles);
            logger.success(`User ${id} roles updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating user ${id} roles`);
        }
    },

    // Delete a user
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting user ${id}`);
            await axios.delete(`${API_URL}/${id}`);
            logger.success(`User ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting user ${id}`);
        }
    },

    // Get available roles
    getRoles: async (): Promise<string[]> => {
        try {
            logger.info('Fetching available roles');

            // Since your API doesn't have a dedicated endpoint for roles,
            // we'll need to extract them from an Identity approach
            // This could be a temporary solution until you add a roles endpoint

            // Option 1: Extract unique roles from all users (if users have all possible roles)
            const users = await UserManagementService.getAll();
            const allRoles = new Set<string>();

            users.forEach(user => {
                if (user.roles && user.roles.length > 0) {
                    user.roles.forEach(role => allRoles.add(role));
                }
            });

            const roles = Array.from(allRoles);
            logger.success(`Extracted ${roles.length} roles from users`);

            // Use hardcoded roles as a fallback if none are found
            if (roles.length === 0) {
                const defaultRoles = ['Admin', 'User'];
                logger.info('No roles found, using default roles:', defaultRoles);
                return defaultRoles;
            }

            return roles;
        } catch (error) {
            // Provide default roles in case of error
            logger.error('Error fetching roles, using default roles:', error);
            return ['Admin', 'User'];
        }
    }
};