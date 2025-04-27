import axios from "axios";

const BASE_URL = "https://cmps383-2025-sp25-p03-g03.azurewebsites.net";

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

export interface SeatTypeDTO {
  id: number;
  seatTypes: string;
}

export const SeatService = {
  getByRoomId: async (roomId: number): Promise<SeatDTO[]> => {
    const response = await axios.get<SeatDTO[]>(`${BASE_URL}/api/Seat/GetByRoomId/${roomId}`);
    return response.data;
  },
};

export const SeatTypeService = {
  getAll: async (): Promise<SeatTypeDTO[]> => {
    const response = await axios.get<SeatTypeDTO[]>(`${BASE_URL}/api/SeatType`);
    return response.data;
  },
};
