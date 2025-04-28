import axios from 'axios';
import { logger } from './LoggerForServices';

// TypeScript interfaces
export interface SeatTakenDTO {
    id: number;
    theaterId: number;
    movieScheduleId: number;
    roomsId: number;
    seatId: number;
    isTaken: boolean;
}

// Base API URL
const API_URL = '/api/SeatTaken';

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

// SeatTaken service methods
export const SeatTakenService = {
    // Get taken seats for a specific schedule
    getBySchedule: async (theaterId: number, movieScheduleId: number, roomId: number ): Promise<SeatTakenDTO[]> => {
        try {

                // Get all seats for this schedule/room
                logger.info(`Fetching all taken seats for schedule: Theater ${theaterId}, Schedule ${movieScheduleId}, Room ${roomId}`);
                const response = await axios.get<SeatTakenDTO[]>(`${API_URL}/GetBySchedule/${theaterId}/${movieScheduleId}/${roomId}`);
                if (!Array.isArray(response.data)) {
                    logger.warn(`API did not return an array, got ${typeof response.data} instead. Returning empty array.`);
                    return [];
                }
                logger.success(`Retrieved ${response.data.length} taken seats for the schedule`);
                return response.data;
            
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                logger.warn(`No taken seats found, returning empty array`);
                return [];
            }
            logger.error(`Error fetching taken seats: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
            return []; // Return empty array on error instead of throwing
        }
    },

    // Create a new taken seat record
    create: async (seatTaken: Omit<SeatTakenDTO, 'id'>): Promise<SeatTakenDTO> => {
        try {
            logger.info('Creating new taken seat record', seatTaken);

            // The controller appears to use the generic controller for POST operations
            // So we'll use the standard GenericController endpoint
            const response = await axios.post<SeatTakenDTO>(API_URL, seatTaken);
            logger.success('Taken seat record created successfully', response.data);
            return response.data;
        } catch (error) {
            // If we get a 405 error, the endpoint may not exist, so let's try the update method
            if (axios.isAxiosError(error) && error.response?.status === 405) {
                logger.warn('POST method not allowed, attempting PUT instead');
                // Try to update the seat status instead of creating
                try {
                    await SeatTakenService.update(
                        seatTaken.theaterId,
                        seatTaken.movieScheduleId,
                        seatTaken.roomsId,
                        seatTaken.seatId,
                        { isTaken: seatTaken.isTaken }
                    );
                    return { id: 0, ...seatTaken }; // Return a synthetic response
                } catch (updateError) {
                    return handleApiError(updateError, 'Creating or updating taken seat record');
                }
            }
            return handleApiError(error, 'Creating new taken seat record');
        }
    },

    // Create multiple taken seat records at once (batch creation)
    createBatch: async (seatsTaken: Omit<SeatTakenDTO, 'id'>[]): Promise<SeatTakenDTO[]> => {
        try {
            logger.info(`Creating batch of ${seatsTaken.length} taken seat records`);
            const response = await axios.post<SeatTakenDTO[]>(`${API_URL}/batch`, seatsTaken);
            logger.success(`${response.data.length} taken seat records created successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating batch of taken seat records');
        }
    },

    // Update an existing taken seat record
    update: async (theaterId: number, movieScheduleId: number, roomId: number, seatId: number, seatTaken: Partial<SeatTakenDTO>): Promise<void> => {
        try {
            logger.info(`Updating taken seat record for Theater ${theaterId}, Schedule ${movieScheduleId}, Room ${roomId}, Seat ${seatId}`, seatTaken);
            await axios.put<void>(`${API_URL}/${theaterId}/${movieScheduleId}/${roomId}/${seatId}`, seatTaken);
            logger.success(`Taken seat record updated successfully`);
        } catch (error) {
            handleApiError(error, `Updating taken seat record for Theater ${theaterId}, Schedule ${movieScheduleId}, Room ${roomId}, Seat ${seatId}`);
        }
    },

    // Delete a taken seat record
    delete: async (theaterId: number, movieScheduleId: number, roomId: number, seatId: number): Promise<void> => {
        try {
            logger.info(`Deleting taken seat record for Theater ${theaterId}, Schedule ${movieScheduleId}, Room ${roomId}, Seat ${seatId}`);
            await axios.delete(`${API_URL}/${theaterId}/${movieScheduleId}/${roomId}/${seatId}`);
            logger.success(`Taken seat record deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting taken seat record for Theater ${theaterId}, Schedule ${movieScheduleId}, Room ${roomId}, Seat ${seatId}`);
        }
    }
};