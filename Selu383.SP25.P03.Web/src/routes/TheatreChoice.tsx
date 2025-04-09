import { useState, useEffect } from "react";
import QRCodeComponent from "../components/qrCode";
import { useAuth } from "../components/authContext";

// Define interfaces matching backend DTOs
interface TicketDto {
  ticketId: number;
  orderId: number;
  screeningId: number;
  seatId: number | null;
  ticketType: string | null;
  price: number;
}

interface UserTicketDto {
  id: number;
  userId: number;
  ticketId: number;
}

export default function MyTickets() {
  const { userId } = useAuth();
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserTickets = async () => {
      try {
        setLoading(true);
        const userTicketsResponse = await fetch(
          `/api/userticket/GetByUserId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!userTicketsResponse.ok) {
          throw new Error("Failed to fetch user tickets");
        }
        const userTickets: UserTicketDto[] = await userTicketsResponse.json();

        const ticketPromises = userTickets.map((ut) =>
          fetch(`/api/ticket/${ut.ticketId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }).then((res) => {
            if (!res.ok)
              throw new Error(`Failed to fetch ticket ${ut.ticketId}`);
            return res.json();
          })
        );
        const ticketData: TicketDto[] = await Promise.all(ticketPromises);

        setTickets(ticketData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserTickets();
  }, [userId]);

  const currentYear = new Date().getFullYear();

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl text-gray-300">
          You need to login to see tickets
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl text-indigo-300 animate-pulse">
          Loading tickets...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl text-red-500 font-bold">Error</div>
          <p className="text-gray-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto mt-16 flex-1">
        <h1 className="text-4xl font-extrabold text-indigo-300 drop-shadow-lg">
          My Tickets
        </h1>
        {tickets.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-lg shadow-lg shadow-indigo-950/50">
            <p className="text-xl text-indigo-200">No tickets found</p>
            <p className="text-gray-300 mt-2">
              Purchase tickets to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className="bg-gray-800 rounded-lg p-6 shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70"
              >
                <h2 className="text-xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
                  Ticket #{ticket.ticketId}
                </h2>
                <div className="space-y-2 text-gray-200">
                  <p>
                    <strong className="text-indigo-400">Order ID:</strong>{" "}
                    {ticket.orderId}
                  </p>
                  <p>
                    <strong className="text-indigo-400">Screening ID:</strong>{" "}
                    {ticket.screeningId}
                  </p>
                  <p>
                    <strong className="text-indigo-400">Seat ID:</strong>{" "}
                    {ticket.seatId ?? "N/A"}
                  </p>
                  <p>
                    <strong className="text-indigo-400">Type:</strong>{" "}
                    {ticket.ticketType ?? "N/A"}
                  </p>
                  <p>
                    <strong className="text-indigo-400">Price:</strong> $
                    {ticket.price.toFixed(2)}
                  </p>
                </div>
                <div className="mt-4">
                  <QRCodeComponent
                    userId={parseInt(userId)}
                    ticketId={ticket.ticketId}
                    value={`ticket:${ticket.ticketId}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full bg-indigo-950 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="hover:text-indigo-300">
              Terms
            </a>
            <a href="/privacy" className="hover:text-indigo-300">
              Privacy
            </a>
            <a href="/contact" className="hover:text-indigo-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
