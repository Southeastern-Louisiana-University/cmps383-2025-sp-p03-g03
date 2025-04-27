import axios from "axios";
import { logger } from "./LoggerForServices";

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

export interface SeatTakenDTO {
  id: number;
  theaterId: number;
  movieScheduleId: number;
  roomsId: number;
  seatTypeId: number;
  isTaken: boolean;
}

export interface SeatTypeDTO {
  id: number;
  name: string;
  price: number;
  color: string;
}

// Base API URLs
const SEAT_API_URL = "/api/Seat";
const SEAT_TAKEN_API_URL = "/api/SeatTaken";
const SEAT_TYPE_API_URL = "/api/SeatType";

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      logger.error(
        `${context} failed with status ${error.response.status}`,
        error
      );
    } else if (error.request) {
      logger.error(
        `${context} failed - no response received from server`,
        error
      );
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
      logger.info(`Fetching all seats from ${SEAT_API_URL}`);
      const response = await axios.get<SeatDTO[]>(SEAT_API_URL);
      logger.success(`Retrieved ${response.data.length} seats`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Fetching all seats");
    }
  },

  // Get seats by room ID
  getByRoomId: async (roomId: number): Promise<SeatDTO[]> => {
    try {
      logger.info(`Fetching seats for room ${roomId}`);
      const response = await axios.get<SeatDTO[]>(
        `${SEAT_API_URL}/GetByRoomId/${roomId}`
      );
      logger.success(
        `Retrieved ${response.data.length} seats for room ${roomId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, `Fetching seats for room ${roomId}`);
    }
  },

  // Get seat reservations for a showing
  getReservationsForShowing: async (
    theaterId: number,
    scheduleId: number,
    roomId: number
  ): Promise<SeatTakenDTO[]> => {
    try {
      logger.info(
        `Fetching seat reservations for showing ${scheduleId} in room ${roomId}`
      );
      const response = await axios.get<SeatTakenDTO[]>(
        `${SEAT_TAKEN_API_URL}/GetBySchedule/${theaterId}/${scheduleId}/${roomId}`
      );
      logger.success(`Retrieved ${response.data.length} seat reservations`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Fetching seat reservations");
    }
  },

  // Create a seat reservation
  createReservation: async (
    theaterId: number,
    scheduleId: number,
    roomId: number,
    seatId: number
  ): Promise<SeatTakenDTO> => {
    try {
      logger.info(`Creating reservation for seat ${seatId}`);
      const response = await axios.post<SeatTakenDTO>(SEAT_TAKEN_API_URL, {
        theaterId,
        movieScheduleId: scheduleId,
        roomsId: roomId,
        seatTypeId: seatId,
        isTaken: true,
      });
      logger.success("Seat reservation created successfully");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Creating seat reservation");
    }
  },

  // Cancel a seat reservation
  cancelReservation: async (
    theaterId: number,
    scheduleId: number,
    roomId: number,
    seatId: number
  ): Promise<void> => {
    try {
      logger.info(`Canceling reservation for seat ${seatId}`);
      await axios.delete(
        `${SEAT_TAKEN_API_URL}/${theaterId}/${scheduleId}/${roomId}/${seatId}`
      );
      logger.success("Seat reservation canceled successfully");
    } catch (error) {
      handleApiError(error, "Canceling seat reservation");
    }
  },
};

// SeatType Service
export const SeatTypeService = {
  // Get all seat types
  getAll: async (): Promise<SeatTypeDTO[]> => {
    try {
      logger.info("Fetching all seat types");
      const response = await axios.get<SeatTypeDTO[]>(SEAT_TYPE_API_URL);
      logger.success(`Retrieved ${response.data.length} seat types`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Fetching all seat types");
    }
  },

  // Get a single seat type by ID
  getById: async (id: number): Promise<SeatTypeDTO> => {
    try {
      logger.info(`Fetching seat type with ID ${id}`);
      const response = await axios.get<SeatTypeDTO>(
        `${SEAT_TYPE_API_URL}/${id}`
      );
      logger.success(`Retrieved seat type ${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Fetching seat type with ID ${id}`);
    }
  },
};

// Utility function to generate seat data
export const generateSeatData = (
  roomId: number,
  numRows: number,
  numColumns: number,
  defaultSeatTypeId: number = 1
): Omit<SeatDTO, "id">[] => {
  const seats: Omit<SeatDTO, "id">[] = [];
  const getRowLabel = (rowIndex: number): string =>
    String.fromCharCode(65 + rowIndex);

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const rowLabel = getRowLabel(rowIndex);
    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
      seats.push({
        roomsId: roomId,
        seatTypeId: defaultSeatTypeId,
        isAvailable: true,
        row: rowLabel,
        seatNumber: colIndex + 1,
        xPosition: colIndex + 1,
        yPosition: rowIndex + 1,
      });
    }
  }
  return seats;
};
