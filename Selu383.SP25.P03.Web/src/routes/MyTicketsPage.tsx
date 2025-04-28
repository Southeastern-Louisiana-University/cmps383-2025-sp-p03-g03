import { useEffect, useState } from "react";
import { useAuth } from "../components/authContext";
import QRCodeComponent from "../components/qrCode";

interface TicketDetails {
  id: number;
  theaterName: string;
  movieName: string;
  movieTime: string;
  roomName: string;
  seatName: string;
  ticketType: string;
  price: number;
  screeningId: number;
  userId: number;
}

export default function TicketDetailsPage() {
  const { userId } = useAuth();
  const [tickets, setTickets] = useState<TicketDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchTickets = async () => {
      try {
        const res = await fetch(`/api/TicketDetails/user/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const data: TicketDetails[] = await res.json();
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  const currentYear = new Date().getFullYear();

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl text-gray-300">
          Please log in to view your tickets.
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
                key={ticket.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70"
              >
                <h2 className="text-xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
                  {ticket.movieName || "Unknown Movie"}
                </h2>
                <div className="space-y-2 text-gray-200">
                  <p>
                    <strong className="text-indigo-400">Showtime:</strong>{" "}
                    {new Date(ticket.movieTime).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <p>
                    <strong className="text-indigo-400">Seat:</strong>{" "}
                    {ticket.seatName || "N/A"}
                  </p>

                  <p>
                    <strong className="text-indigo-400">Ticket Type:</strong>{" "}
                    {ticket.ticketType}
                  </p>
                  <p>
                    <strong className="text-indigo-400">Price:</strong> $
                    {ticket.price.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4">
                  <strong className="text-indigo-400">QR Code:</strong>
                  <QRCodeComponent
                    userId={ticket.userId}
                    ticketId={ticket.id}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="w-full bg-indigo-950 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
