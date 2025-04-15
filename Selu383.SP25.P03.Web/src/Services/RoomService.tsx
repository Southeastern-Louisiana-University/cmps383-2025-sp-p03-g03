import axios from 'axios';
import { logger } from './LoggerForServices';

// TypeScript interfaces
export interface RoomDTO {
    id: number;
    name?: string;
    numOfSeats: number;
    rows: number;
    columns: number;
    screenType?: string;
    audio?: string;
    isActive: boolean;
    isPremium: boolean;
    timeToClean: number;
    theaterId: number;
}

// Base API URL
const API_URL = '/api/Room';

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string): never => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            logger.error(`${context} failed with status ${error.response.status}`, error);
        } else if (error.request) {
            logger.error(`${context} failed - no response received from server`, error);
        } else {
            logger.error(`${context} failed - request setup error`, error);
        }
    } else {
        logger.error(`${context} failed with non-axios error`, error);
    }
    throw error;
};

// Room service methods
export const RoomService = {
    // Get all rooms
    getAll: async (): Promise<RoomDTO[]> => {
        try {
            logger.info(`Fetching all rooms from ${API_URL}`);
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${API_URL}${cacheBuster}`;
            const response = await axios.get<RoomDTO[]>(url);
            logger.success(`Retrieved ${response.data.length} rooms`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all rooms');
        }
    },

    // Get rooms by theater ID
    getByTheaterId: async (theaterId: number): Promise<RoomDTO[]> => {
        try {
            logger.info(`Fetching rooms for theater ${theaterId}`);
            const response = await axios.get<RoomDTO[]>(`${API_URL}/GetByMovieId/${theaterId}`); //Room/GetByMovieId/
            logger.success(`Retrieved ${response.data.length} rooms for theater ${theaterId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching rooms for theater ${theaterId}`);
        }
    },

    // Get a single room by ID
    getById: async (id: number): Promise<RoomDTO> => {
        try {
            logger.info(`Fetching room with ID ${id}`);
            const response = await axios.get<RoomDTO>(`${API_URL}/${id}`);
            logger.success(`Retrieved room ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching room with ID ${id}`);
        }
    },

    // Create a new room
    create: async (room: Omit<RoomDTO, 'id'>): Promise<RoomDTO> => {
        try {
            logger.info('Creating new room', room);
            const response = await axios.post<RoomDTO>(API_URL, room);
            logger.success('Room created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new room');
        }
    },

    // Update an existing room
    update: async (id: number, room: RoomDTO): Promise<RoomDTO> => {
        try {
            logger.info(`Updating room ${id}`, room);
            const response = await axios.put<RoomDTO>(`${API_URL}/${id}`, room);
            logger.success(`Room ${id} updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating room ${id}`);
        }
    },

    // Delete a room
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting room ${id}`);
            await axios.delete(`${API_URL}/${id}`);
            logger.success(`Room ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting room ${id}`);
        }
    },

    // Toggle room active status
    toggleActive: async (id: number, active: boolean): Promise<RoomDTO> => {
        try {
            logger.info(`Toggling active status of room ${id} to ${active}`);
            const payload = { active: active };
            const response = await axios.patch<RoomDTO>(`${API_URL}/${id}/toggle-active`, payload);
            logger.success(`Room ${id} active status toggled to ${active}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Toggling active status for room ${id}`);
        }
    }
};