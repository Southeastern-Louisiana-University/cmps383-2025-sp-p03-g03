import axios from 'axios';

// TypeScript interfaces
export interface MovieScheduleDTO {
    id: number;
    movieId: number;
    isActive: boolean;
    movieTimes: string[]; // DateTime strings in ISO format
}

export interface MovieRoomScheduleLinkDTO {
    id: number;
    theaterId: number;
    roomId: number;
    movieId: number;
    movieScheduleId: number;
}

export interface Movie {
    id: number;
    title: string;
    description?: string;
    runtime: number;
    isActive: boolean;
    ageRating?: string;
    releaseDate: string;
    category?: string;
}

export interface Theater {
    id: number;
    active: boolean;
    name: string;
    address1?: string;
    city?: string;
    state?: string;
}

export interface Room {
    id: number;
    name: string;
    numOfSeats: number;
    isActive: boolean;
    theaterId: number;
}

// Reference to logger from the imported module
import { logger } from './LoggerForServices'; // Make sure to create or import this

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

            // Check if we received HTML instead of JSON (usually indicates server error)
            const contentType = error.response.headers['content-type'];
            if (contentType && contentType.includes('text/html')) {
                logger.error('Received HTML response instead of JSON. Backend server may be down or unreachable.',error);
            }
        } else if (error.request) {
            logger.error('No response received from server', error);
        } else {
            logger.error('Request configuration error', error);
        }
        return Promise.reject(error);
    }
);

// Base API URLs
const API_BASE_URL = '/api';
const SCHEDULE_API_URL = `${API_BASE_URL}/movieschedule`;
const SCHEDULE_LINK_API_URL = `${API_BASE_URL}/MovieRoomScheduleLink`;
const MOVIE_API_URL = `${API_BASE_URL}/Movie`;
const ROOM_API_URL = `${API_BASE_URL}/Room`;

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string): never => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with an error status
            logger.error(
                `${context} failed with status ${error.response.status}`,
                error
            );

            // Check if response is HTML instead of JSON
            const contentType = error.response.headers['content-type'];
            if (contentType && contentType.includes('text/html')) {
                error.message = 'Server error: Received HTML instead of JSON data. Backend server may be down.';
            }
        } else if (error.request) {
            // Request was made but no response
            logger.error(
                `${context} failed - no response received from server`,
                error
            );
            error.message = 'Server error: No response received. The backend server may be down or unreachable.';
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

// MovieSchedule service methods
export const MovieScheduleService = {
    // Get all schedules
    getAll: async (): Promise<MovieScheduleDTO[]> => {
        try {
            logger.info(`Fetching all movie schedules from ${SCHEDULE_API_URL}`);

            // Add timestamp to URL to prevent caching issues
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${SCHEDULE_API_URL}${cacheBuster}`;

            const response = await axios.get<MovieScheduleDTO[]>(url);
            logger.success(`Retrieved ${response.data.length} movie schedules`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all movie schedules');
        }
    },

    // Get a single schedule by ID
    getById: async (id: number): Promise<MovieScheduleDTO> => {
        try {
            logger.info(`Fetching movie schedule with ID ${id}`);
            const response = await axios.get<MovieScheduleDTO>(`${SCHEDULE_API_URL}/${id}`);
            logger.success(`Retrieved movie schedule ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching movie schedule with ID ${id}`);
        }
    },

    // Create a new schedule
    create: async (schedule: Omit<MovieScheduleDTO, 'id'>): Promise<MovieScheduleDTO> => {
        try {
            logger.info('Creating new movie schedule', schedule);
            const response = await axios.post<MovieScheduleDTO>(SCHEDULE_API_URL, schedule);
            logger.success('Movie schedule created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new movie schedule');
        }
    },

    // Update an existing schedule
    update: async (id: number, schedule: MovieScheduleDTO): Promise<MovieScheduleDTO> => {
        try {
            logger.info(`Updating movie schedule ${id}`, schedule);
            const response = await axios.put<MovieScheduleDTO>(`${SCHEDULE_API_URL}/${id}`, schedule);
            logger.success(`Movie schedule ${id} updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating movie schedule ${id}`);
        }
    },

    // Delete a schedule
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting movie schedule ${id}`);
            await axios.delete(`${SCHEDULE_API_URL}/${id}`);
            logger.success(`Movie schedule ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting movie schedule ${id}`);
        }
    },

    // Toggle schedule active status
    toggleActive: async (id: number, isActive: boolean): Promise<MovieScheduleDTO> => {
        try {
            logger.info(`Toggling active status of movie schedule ${id} to ${isActive}`);
            const payload = { isActive: isActive };
            const response = await axios.patch<MovieScheduleDTO>(`${SCHEDULE_API_URL}/${id}/toggle-active`, payload);
            logger.success(`Movie schedule ${id} active status toggled to ${isActive}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Toggling active status for movie schedule ${id}`);
        }
    },
};

// MovieRoomScheduleLink service methods
export const MovieRoomScheduleLinkService = {
    // Get all schedule links
    getAll: async (): Promise<MovieRoomScheduleLinkDTO[]> => {
        try {
            logger.info(`Fetching all movie room schedule links from ${SCHEDULE_LINK_API_URL}`);
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${SCHEDULE_LINK_API_URL}${cacheBuster}`;
            const response = await axios.get<MovieRoomScheduleLinkDTO[]>(url);
            logger.success(`Retrieved ${response.data.length} movie room schedule links`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all movie room schedule links');
        }
    },

    // Get links by movie schedule ID
    getByScheduleId: async (scheduleId: number): Promise<MovieRoomScheduleLinkDTO[]> => {
        try {
            logger.info(`Fetching movie room schedule links for schedule ID ${scheduleId}`);
            const response = await axios.get<MovieRoomScheduleLinkDTO[]>(`${SCHEDULE_LINK_API_URL}/GetByScheduleId/${scheduleId}`); ///api/MovieRoomScheduleLink/GetByScheduleId/
            logger.success(`Retrieved ${response.data.length} links for schedule ${scheduleId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching links for schedule ID ${scheduleId}`);
        }
    },

    // Create a new schedule link
    create: async (link: Omit<MovieRoomScheduleLinkDTO, 'id'>): Promise<MovieRoomScheduleLinkDTO> => {
        try {
            logger.info('Creating new movie room schedule link', link);
            const response = await axios.post<MovieRoomScheduleLinkDTO>(SCHEDULE_LINK_API_URL, link);
            logger.success('Movie room schedule link created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new movie room schedule link');
        }
    },

    // Delete a schedule link
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting movie room schedule link ${id}`);
            await axios.delete(`${SCHEDULE_LINK_API_URL}/${id}`);
            logger.success(`Movie room schedule link ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting movie room schedule link ${id}`);
        }
    },
};

// Movie service methods
export const MovieService = {
    // Get all movies
    getAll: async (): Promise<Movie[]> => {
        try {
            logger.info('Fetching all movies');
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${MOVIE_API_URL}${cacheBuster}`;
            const response = await axios.get<Movie[]>(url);
            logger.success(`Retrieved ${response.data.length} movies`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all movies');
        }
    },

    // Get active movies only
    getActive: async (): Promise<Movie[]> => {
        try {
            logger.info('Fetching active movies');
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${MOVIE_API_URL}/active${cacheBuster}`;
            const response = await axios.get<Movie[]>(url);
            logger.success(`Retrieved ${response.data.length} active movies`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching active movies');
        }
    }
};

// Import TheaterService from your project
//import { TheaterService } from '../Services/UnitService';

// Room service methods
export const RoomService = {
    // Get all rooms
    getAll: async (): Promise<Room[]> => {
        try {
            logger.info('Fetching all rooms');
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${ROOM_API_URL}${cacheBuster}`;
            const response = await axios.get<Room[]>(url);
            logger.success(`Retrieved ${response.data.length} rooms`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all rooms');
        }
    },

    // Get rooms by theater ID
    getByTheaterId: async (theaterId: number): Promise<Room[]> => {
        try {
            logger.info(`Fetching rooms for theater ID ${theaterId}`);
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${ROOM_API_URL}/theater/${theaterId}${cacheBuster}`;
            const response = await axios.get<Room[]>(url);
            logger.success(`Retrieved ${response.data.length} rooms for theater ${theaterId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching rooms for theater ID ${theaterId}`);
        }
    },

    // Get active rooms by theater ID
    getActiveByTheaterId: async (theaterId: number): Promise<Room[]> => {
        try {
            logger.info(`Fetching active rooms for theater ID ${theaterId}`);
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${ROOM_API_URL}/theater/${theaterId}/active${cacheBuster}`;
            const response = await axios.get<Room[]>(url);
            logger.success(`Retrieved ${response.data.length} active rooms for theater ${theaterId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching active rooms for theater ID ${theaterId}`);
        }
    }
};