import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface TicketDetails {
  id: number;
  orderId: number;
  screeningId: number;
  seatId: number;
  ticketType: string;
  price: number;
}

export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/ticket/${ticketId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch ticket");
        }
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching ticket");
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!ticket) {
    return (
      <div className="text-center text-gray-400">Loading ticket info...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-indigo-300 mb-6">
        Ticket Info
      </h1>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg shadow-indigo-950/50 w-full max-w-md">
        <p>
          <strong>Ticket ID:</strong> {ticket.id}
        </p>
        <p>
          <strong>Order ID:</strong> {ticket.orderId}
        </p>
        <p>
          <strong>Screening ID:</strong> {ticket.screeningId}
        </p>
        <p>
          <strong>Seat ID:</strong> {ticket.seatId}
        </p>
        <p>
          <strong>Ticket Type:</strong> {ticket.ticketType}
        </p>
        <p>
          <strong>Price:</strong> ${ticket.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
