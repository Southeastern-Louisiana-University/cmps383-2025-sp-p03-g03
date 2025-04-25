import axios from 'axios';
import { logger } from './LoggerForServices';

// TypeScript interfaces
export interface SeatDTO {
    id: number;
    seatTypeId: number;
    roomsId: number;
    isAvailable: boolean;
    row: string;
    seatNumber: number;
    xPosition: number;
    yPosition: number;
}

// Base API URL
const API_URL = '/api/Seat';

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

// Seat service methods
export const SeatService = {
    // Get all seats
    getAll: async (): Promise<SeatDTO[]> => {
        try {
            logger.info(`Fetching all seats from ${API_URL}`);
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${API_URL}${cacheBuster}`;
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
            const response = await axios.get<SeatDTO[]>(`${API_URL}/GetByRoomId/${roomId}`);
            logger.success(`Retrieved ${response.data.length} seats for room ${roomId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching seats for room ${roomId}`);
        }
    },

    // Get a single seat by ID
    getById: async (id: number): Promise<SeatDTO> => {
        try {
            logger.info(`Fetching seat with ID ${id}`);
            const response = await axios.get<SeatDTO>(`${API_URL}/${id}`);
            logger.success(`Retrieved seat ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching seat with ID ${id}`);
        }
    },

    // Create a new seat
    create: async (seat: Omit<SeatDTO, 'id'>): Promise<SeatDTO> => {
        try {
            logger.info('Creating new seat', seat);
            const response = await axios.post<SeatDTO>(API_URL, seat);
            logger.success('Seat created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new seat');
        }
    },

    // Create multiple seats at once (batch creation)
    createBatch: async (seats: Omit<SeatDTO, 'id'>[]): Promise<SeatDTO[]> => {
        try {
            logger.info(`Creating batch of ${seats.length} seats`);
            const response = await axios.post<SeatDTO[]>(`${API_URL}/batch`, seats);
            logger.success(`${response.data.length} seats created successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating batch of seats');
        }
    },

    // Update an existing seat
    update: async (id: number, seat: SeatDTO): Promise<SeatDTO> => {
        try {
            logger.info(`Updating seat ${id}`, seat);
            const response = await axios.put<SeatDTO>(`${API_URL}/${id}`, seat);
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
            await axios.delete(`${API_URL}/${id}`);
            logger.success(`Seat ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting seat ${id}`);
        }
    },

    // Delete all seats for a room
    deleteByRoomId: async (roomId: number): Promise<void> => {
        try {
            logger.info(`Deleting all seats for room ${roomId}`);
            await axios.delete(`${API_URL}/room/${roomId}`);
            logger.success(`All seats for room ${roomId} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting seats for room ${roomId}`);
        }
    },

    // Generate seats for a room
    generateSeatsForRoom: async (roomId: number, rows: number, columns: number, defaultSeatTypeId: number = 1): Promise<SeatDTO[]> => {
        try {
            logger.info(`Generating ${rows * columns} seats for room ${roomId}`);

            // If using the backend endpoint
            const response = await axios.post<SeatDTO[]>(`${API_URL}/generate`, {
                roomId,
                rows,
                columns,
                defaultSeatTypeId
            });

            logger.success(`Generated ${response.data.length} seats for room ${roomId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Generating seats for room ${roomId}`);
        }
    }
};

// Interface for seat type
export interface SeatTypeDTO {
    id: number;
    seatTypes: string;
}

// SeatType Service
export const SeatTypeService = {
    // Get all seat types
    getAll: async (): Promise<SeatTypeDTO[]> => {
        try {
            logger.info('Fetching all seat types');
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `/api/SeatType${cacheBuster}`;
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
            const response = await axios.get<SeatTypeDTO>(`/api/SeatType/${id}`);
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
            const response = await axios.post<SeatTypeDTO>('/api/SeatType', seatType);
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
            const response = await axios.put<SeatTypeDTO>(`/api/SeatType/${id}`, seatType);
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
            await axios.delete(`/api/SeatType/${id}`);
            logger.success(`Seat type ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting seat type ${id}`);
        }
    }
};

// Utility function to generate seat data in the frontend
// This can be used if we want to create the seats on the frontend and then send them to the backend
export const generateSeatData = (
    roomId: number,
    numRows: number,
    numColumns: number,
    defaultSeatTypeId: number = 1
): Omit<SeatDTO, 'id'>[] => {
    const seats: Omit<SeatDTO, 'id'>[] = [];

    // Generate a-z row labels (and then continue with aa, ab, etc. if needed)
    const getRowLabel = (rowIndex: number): string => {
        if (rowIndex < 26) {
            return String.fromCharCode(65 + rowIndex); // A-Z
        }

        // For rows beyond Z (26+)
        const firstChar = String.fromCharCode(65 + Math.floor(rowIndex / 26) - 1);
        const secondChar = String.fromCharCode(65 + (rowIndex % 26));
        return `${firstChar}${secondChar}`;
    };

    let yPosition = 1;

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const rowLabel = getRowLabel(rowIndex);

        for (let colIndex = 0; colIndex < numColumns; colIndex++) {
            const seatNumber = colIndex + 1;
            const xPosition = colIndex + 1;

            seats.push({
                roomsId: roomId,
                seatTypeId: defaultSeatTypeId,
                isAvailable: true,
                row: rowLabel,
                seatNumber: seatNumber,
                xPosition: xPosition,
                yPosition: yPosition
            });
        }

        yPosition++;
    }

    return seats;
};