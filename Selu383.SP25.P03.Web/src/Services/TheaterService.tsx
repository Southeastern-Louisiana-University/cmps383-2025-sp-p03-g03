import axios from 'axios';
import { logger } from './LoggerForServices';

// TypeScript interfaces
export interface TheaterDTO {
    id: number;
    active: boolean;
    name: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone1?: string;
    phone2?: string;
    managerId?: number;
}

// Add request/response interceptors for debugging
axios.interceptors.request.use(
    config => {
        logger.request(
            config.method?.toUpperCase() || 'UNKNOWN',
            config.url || 'UNKNOWN URL',
            config.data || null
        );
        return config;
    },
    error => {
        logger.error('Request failed to send', error);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        logger.success(`Response received [${response.status}] from ${response.config.url}`);
        return response;
    },
    error => {
        if (error.response) {
            logger.error(`API Error [${error.response.status}] from ${error.config?.url}`, error);
        } else if (error.request) {
            logger.error('No response received from server', error);
        } else {
            logger.error('Request configuration error', error);
        }
        return Promise.reject(error);
    }
);

// Base API URL
const API_URL = '/api/theaters';

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

// Theater service methods
export const TheaterService = {
    // Get all theaters
    getAll: async (): Promise<TheaterDTO[]> => {
        try {
            logger.info(`Fetching all theaters from ${API_URL}`);

            // Add timestamp to URL to prevent caching issues
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${API_URL}${cacheBuster}`;

            const response = await axios.get<TheaterDTO[]>(url);

            // Log response details
            logger.success(`Retrieved ${response.data.length} theaters`);
            if (response.data.length === 0) {
                logger.warn('No theaters returned from API');
            } else {
                logger.info('First few theaters:', response.data.slice(0, 3));
            }

            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all theaters');
        }
    },

    // Get a single theater by ID
    getById: async (id: number): Promise<TheaterDTO> => {
        try {
            logger.info(`Fetching theater with ID ${id}`);
            const response = await axios.get<TheaterDTO>(`${API_URL}/${id}`);
            logger.success(`Retrieved theater ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching theater with ID ${id}`);
        }
    },

    // Create a new theater
    create: async (theater: Omit<TheaterDTO, 'id'>): Promise<TheaterDTO> => {
        try {
            logger.info('Creating new theater', theater);
            const response = await axios.post<TheaterDTO>(API_URL, theater);
            logger.success('Theater created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new theater');
        }
    },

    // Update an existing theater
    update: async (id: number, theater: TheaterDTO): Promise<TheaterDTO> => {
        try {
            logger.info(`Updating theater ${id}`, theater);
            const response = await axios.put<TheaterDTO>(`${API_URL}/${id}`, theater);
            logger.success(`Theater ${id} updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating theater ${id}`);
        }
    },

    // Delete a theater
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting theater ${id}`);
            await axios.delete(`${API_URL}/${id}`);
            logger.success(`Theater ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting theater ${id}`);
        }
    },

    // Toggle theater active status
    toggleActive: async (id: number, active: boolean): Promise<TheaterDTO> => {
        try {
            logger.info(`Toggling active status of theater ${id} to ${active}`);

            // Construct the proper payload
            const payload = { active: active };

            const response = await axios.patch<TheaterDTO>(`${API_URL}/${id}/toggle-active`, payload);

            logger.success(`Theater ${id} active status toggled to ${active}`);

            // Make sure to return the updated theater object from the response
            return response.data;
        } catch (error) {
            return handleApiError(error, `Toggling active status for theater ${id}`);
        }
    },
};

// User service for managers
export const UserService = {
    // Get all users with manager role
    getManagers: async (): Promise<{ id: number, userName: string }[]> => {
        try {
            logger.info('Fetching all managers');
            const response = await axios.get<{ id: number, userName: string }[]>('https://localhost:7098/api/user/managers');
            logger.success(`Retrieved ${response.data.length} managers`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all managers');
        }
    }
};