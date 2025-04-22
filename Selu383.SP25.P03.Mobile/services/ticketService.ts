// services/ticketService.ts
import axios from "axios";
import { BASE_URL } from "@/utils/baseUrl";

export interface UserTicket {
  id: number;
  userId: number;
  movieTitle: string;
  theaterName: string;
  showTime: string;
  seatNumber?: string;
  qrCodeData?: string;
}

export const getTicketsByUserId = async (userId: number): Promise<UserTicket[]> => {
  const res = await axios.get(`${BASE_URL}/api/userticket/GetByUserId/${userId}`);
  return res.data;
};
