import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@headlessui/react";
import { ArrowLeftIcon, TicketIcon } from "@heroicons/react/24/outline";

interface Seat {
  id: number;
  seatTypeId: number;
  roomsId: number;
  isAvailable: boolean;
  row: string;
  seatNumber: number;
  xPosition: number;
  yPosition: number;
  identifier?: string;
}

interface Theater {
  id: number;
  name: string;
  location?: string;
}

interface Showtime {
  id: number;
  time: string;
  movieId: number;
  theaterId?: number;
  roomId?: number;
}

interface Movie {
  id: number;
  title: string;
  ageRating: string;
  runtime: number;
  releaseDate?: string;
  category?: string;
  description?: string;
}

interface RoomSeatsDto {
  id: number;
  roomId: number;
  seatId: number;
}

export default function SeatSelection() {
  const { movieId, theaterId, roomId, scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { time, movie, theater, room } = location.state || {};

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId || !theaterId || !roomId || !scheduleId || !movie) {
      navigate(-1);
      return;
    }

    const fetchSeats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get seats directly first
        const seatsResponse = await fetch("/api/seat");
        if (!seatsResponse.ok) throw new Error("Failed to fetch seats");

        const allSeats: Seat[] = await seatsResponse.json();
        const seatsForRoom = allSeats.filter(
          (seat) => seat.roomsId === Number(roomId)
        );

        if (seatsForRoom.length > 0) {
          setSeats(seatsForRoom);
          return;
        }

        // If no direct seats found, try through roomseats
        const roomSeatsResponse = await fetch("/api/roomseats");
        if (!roomSeatsResponse.ok)
          throw new Error("Failed to fetch room seats");

        const allRoomSeats: RoomSeatsDto[] = await roomSeatsResponse.json();
        const roomSeatRelations = allRoomSeats.filter(
          (rs) => rs.roomId === Number(roomId)
        );

        if (roomSeatRelations.length > 0) {
          const seatIds = roomSeatRelations.map((rs) => rs.seatId);
          const matchedSeats = allSeats.filter((seat) =>
            seatIds.includes(seat.id)
          );
          setSeats(
            matchedSeats.length > 0
              ? matchedSeats
              : generateTestSeats(Number(roomId))
          );
        } else {
          setSeats(generateTestSeats(Number(roomId)));
        }
      } catch (err) {
        console.error("Error loading seats:", err);
        setError(
          "Using test data - seat assignments may not match actual theater"
        );
        setSeats(generateTestSeats(Number(roomId)));
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [movieId, theaterId, roomId, scheduleId, movie, navigate]);

  const generateTestSeats = (roomId: number): Seat[] => {
    const seats: Seat[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = roomId === 14 ? 10 : roomId === 1 ? 20 : 15;
    const seatSpacing = 40;
    const rowSpacing = 50;
    const centerOffset = (seatsPerRow * seatSpacing) / 2;

    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        let seatTypeId: number;

        if (roomId === 14) {
          seatTypeId = 5;
        } else if (roomId === 1) {
          if (rowIndex === 0 || rowIndex === 1) {
            seatTypeId = 5;
          } else if (rowIndex === 2 || rowIndex === 3) {
            seatTypeId = 2;
          } else if (rowIndex === 4 && (i === 1 || i === seatsPerRow)) {
            seatTypeId = 4;
          } else if (rowIndex >= 6) {
            seatTypeId = 3;
          } else {
            seatTypeId = 1;
          }
        } else {
          if (rowIndex === 0) {
            seatTypeId = 5;
          } else if (rowIndex === 1 || rowIndex === 2) {
            seatTypeId = 2;
          } else if (rowIndex === 3 && (i <= 2 || i >= seatsPerRow - 1)) {
            seatTypeId = 4;
          } else if (rowIndex >= 5) {
            seatTypeId = 3;
          } else {
            seatTypeId = 1;
          }
        }

        seats.push({
          id: rowIndex * seatsPerRow + i,
          seatTypeId,
          roomsId: roomId,
          isAvailable: Math.random() > 0.3,
          row,
          seatNumber: i,
          xPosition: i * seatSpacing - centerOffset,
          yPosition: rowIndex * rowSpacing + 50,
          identifier: `${row}${i.toString().padStart(2, "0")}`,
        });
      }
    });

    return seats;
  };

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        selectedSeats,
        showtime: {
          id: scheduleId,
          time,
          movieId: Number(movieId),
          theaterId: Number(theaterId),
          roomId: Number(roomId),
        },
        theater,
        movie,
        room,
      },
    });
  };

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300 mb-4"></div>
        <p className="text-indigo-300">Loading seat map...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6 flex-1">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-400 mb-6 hover:text-indigo-300 transition-colors duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to showtimes
        </Button>

        {error && (
          <div className="bg-yellow-900/50 text-yellow-200 p-4 rounded-lg mb-6 flex items-start">
            <div className="flex-1">
              <p className="font-bold">Notice:</p>
              <p>{error}</p>
              <p className="text-sm mt-2">
                You can still proceed with test data, but some features may be
                limited.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-300 mb-1 drop-shadow-lg">
            Select Your Seats
          </h1>
          <p className="text-lg text-gray-300">
            {movie?.title || "Unknown Movie"} •{" "}
            {theater?.name || "Unknown Theater"} •{" "}
            {time
              ? new Date(time).toLocaleString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No showtime selected"}
          </p>
        </div>

        <div className="bg-gradient-to-t from-indigo-950 to-gray-800 text-white text-center py-6 mb-8 rounded-lg shadow-lg shadow-indigo-950/50">
          <h2 className="text-xl font-bold text-indigo-200 drop-shadow-md">
            SCREEN
          </h2>
        </div>

        <div className="overflow-auto pb-6 mb-8">
          <div
            className="relative border border-gray-700 rounded-lg p-4 bg-gray-800 mx-auto shadow-lg shadow-indigo-950/50"
            style={{
              width: "100%",
              minHeight: "500px",
              overflow: "visible",
            }}
          >
            {seats.map((seat) => (
              <button
                key={seat.id}
                className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    !seat.isAvailable
                      ? "bg-red-600 cursor-not-allowed opacity-70"
                      : selectedSeats.some((s) => s.id === seat.id)
                      ? "bg-indigo-600 text-white scale-110 shadow-md"
                      : "bg-green-600 text-white hover:bg-green-500 hover:scale-105 hover:shadow-md"
                  }
                  ${
                    seat.seatTypeId === 2
                      ? "ring-2 ring-yellow-400"
                      : seat.seatTypeId === 3
                      ? "ring-2 ring-purple-400"
                      : seat.seatTypeId === 4
                      ? "ring-2 ring-blue-400"
                      : seat.seatTypeId === 5
                      ? "ring-2 ring-amber-400"
                      : ""
                  }`}
                style={{
                  left: `calc(50% + ${seat.xPosition}px)`,
                  top: `${seat.yPosition}px`,
                  transform: "translateX(-100%)",
                }}
                onClick={() => handleSeatClick(seat)}
                disabled={!seat.isAvailable}
                aria-label={`Seat ${seat.row}${seat.seatNumber}`}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg shadow-indigo-950/50">
          <h2 className="text-xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
            Your Selection ({selectedSeats.length})
          </h2>

          {selectedSeats.length > 0 ? (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {selectedSeats.map((seat) => (
                  <li
                    key={seat.id}
                    className="bg-gray-700 p-3 rounded-lg shadow-xs"
                  >
                    <span className="font-medium text-indigo-200">
                      {seat.row}
                      {seat.seatNumber}
                    </span>
                    <span className="text-sm text-gray-300 block mt-1">
                      {seat.seatTypeId === 1
                        ? "Standard"
                        : seat.seatTypeId === 2
                        ? "Premium"
                        : seat.seatTypeId === 3
                        ? "Recliner"
                        : seat.seatTypeId === 4
                        ? "Accessible"
                        : "VIP"}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleCheckout}
                className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
                <TicketIcon className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-300">Select seats to continue</p>
              <p className="text-sm text-gray-400 mt-1">
                Click on available seats (green) to select them
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-600 rounded-full ring-2 ring-yellow-400"></div>
            <span className="text-sm text-gray-300">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-600 rounded-full ring-2 ring-purple-400"></div>
            <span className="text-sm text-gray-300">Recliner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-600 rounded-full ring-2 ring-blue-400"></div>
            <span className="text-sm text-gray-300">Accessible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-600 rounded-full ring-2 ring-amber-400"></div>
            <span className="text-sm text-gray-300">VIP</span>
          </div>
        </div>
      </div>

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
