import axios from 'axios';
import { logger } from './LoggerForServices';

// TypeScript interfaces
export interface SeatTypeDTO {
    id: number;
    seatTypes?: string;
}

export interface SeatDTO {
    id: number;
    seatTypeId: number;
    roomsId: number;
    isAvailable: boolean;
    row?: string;
    seatNumber: number;
    xPosition: number;
    yPosition: number;
}

export interface SeatRowConfiguration {
    rowId: string;
    rowName: string;
    numberOfSeats: number;
    seatTypeId: number;
    startX: number;
    startY: number;
    gapBetweenSeats: number;
    isInUse: boolean;
}

// Base API URLs
const SEAT_TYPE_API_URL = '/api/SeatType';
const SEAT_API_URL = '/api/Seat';

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

// Seat Type service methods
export const SeatTypeService = {
    // Get all seat types
    getAll: async (): Promise<SeatTypeDTO[]> => {
        try {
            logger.info(`Fetching all seat types from ${SEAT_TYPE_API_URL}`);
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${SEAT_TYPE_API_URL}${cacheBuster}`;
            const response = await axios.get<SeatTypeDTO[]>(url);
            logger.success(`Retrieved ${response.data.length} seat types`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all seat types');
        }
    },

    // Get a single seat type by ID
    getById: async (id: number): Promise<SeatTypeDTO> => {
        try {
            logger.info(`Fetching seat type with ID ${id}`);
            const response = await axios.get<SeatTypeDTO>(`${SEAT_TYPE_API_URL}/${id}`);
            logger.success(`Retrieved seat type ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching seat type with ID ${id}`);
        }
    },

    // Create a new seat type
    create: async (seatType: Omit<SeatTypeDTO, 'id'>): Promise<SeatTypeDTO> => {
        try {
            logger.info('Creating new seat type', seatType);
            const response = await axios.post<SeatTypeDTO>(SEAT_TYPE_API_URL, seatType);
            logger.success('Seat type created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new seat type');
        }
    },

    // Update an existing seat type
    update: async (id: number, seatType: SeatTypeDTO): Promise<SeatTypeDTO> => {
        try {
            logger.info(`Updating seat type ${id}`, seatType);
            const response = await axios.put<SeatTypeDTO>(`${SEAT_TYPE_API_URL}/${id}`, seatType);
            logger.success(`Seat type ${id} updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating seat type ${id}`);
        }
    },

    // Delete a seat type
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting seat type ${id}`);
            await axios.delete(`${SEAT_TYPE_API_URL}/${id}`);
            logger.success(`Seat type ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting seat type ${id}`);
        }
    }
};

// Seat service methods
export const SeatService = {
    // Get all seats
    getAll: async (): Promise<SeatDTO[]> => {
        try {
            logger.info(`Fetching all seats from ${SEAT_API_URL}`);
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${SEAT_API_URL}${cacheBuster}`;
            const response = await axios.get<SeatDTO[]>(url);
            logger.success(`Retrieved ${response.data.length} seats`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all seats');
        }
    },

    // Get seats by room ID
    getByRoomId: async (roomId: number): Promise<SeatDTO[]> => {
        try {
            logger.info(`Fetching seats for room ${roomId}`);
            const response = await axios.get<SeatDTO[]>(`${SEAT_API_URL}/room/${roomId}`);
            logger.success(`Retrieved ${response.data.length} seats for room ${roomId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching seats for room ${roomId}`);
        }
    },

    // Create multiple seats for a row
    createRow: async (roomId: number, rowConfig: SeatRowConfiguration): Promise<SeatDTO[]> => {
        try {
            logger.info(`Creating row of seats for room ${roomId}`, rowConfig);
            const response = await axios.post<SeatDTO[]>(`${SEAT_API_URL}/createrow/${roomId}`, rowConfig);
            logger.success(`Created ${response.data.length} seats for row ${rowConfig.rowName}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Creating row of seats for room ${roomId}`);
        }
    },

    // Update a single seat
    update: async (id: number, seat: SeatDTO): Promise<SeatDTO> => {
        try {
            logger.info(`Updating seat ${id}`, seat);
            const response = await axios.put<SeatDTO>(`${SEAT_API_URL}/${id}`, seat);
            logger.success(`Seat ${id} updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating seat ${id}`);
        }
    },

    // Delete a seat
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting seat ${id}`);
            await axios.delete(`${SEAT_API_URL}/${id}`);
            logger.success(`Seat ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting seat ${id}`);
        }
    },

    // Delete all seats in a row
    deleteRow: async (roomId: number, rowName: string): Promise<void> => {
        try {
            logger.info(`Deleting row ${rowName} in room ${roomId}`);
            await axios.delete(`${SEAT_API_URL}/deleterow/${roomId}/${rowName}`);
            logger.success(`Row ${rowName} in room ${roomId} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting row ${rowName} in room ${roomId}`);
        }
    }
};