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

        console.log("Fetching seats for roomId:", roomId);
        const seatsResponse = await fetch(`/api/seat/GetByRoomId/${roomId}`);
        if (!seatsResponse.ok) {
          const text = await seatsResponse.text();
          console.error(`Fetch error: ${seatsResponse.status} ${text}`);
          throw new Error(
            `Failed to fetch seats: ${seatsResponse.status} ${text}`
          );
        }

        const seats: Seat[] = await seatsResponse.json();
        console.log("Seats for roomId", roomId, ":", seats);
        console.log("Seats count:", seats.length);

        if (seats.length > 0) {
          setSeats(seats);
          return;
        }

        console.warn("No seats found, using test seats");
        setError("No seats found for this room");
        setSeats(generateTestSeats(Number(roomId)));
      } catch (err) {
        console.error("Error loading seats:", err);
        setError(
          `Failed to load seats: ${
            err instanceof Error ? err.message : "Unknown error"
          }. Using test data.`
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
    const rows =
      roomId === 59
        ? ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        : roomId === 60
        ? ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        : roomId === 61
        ? ["A", "B", "C", "D", "E", "F", "G", "H"]
        : ["A", "B", "C", "D", "E", "F"];
    const seatsPerRow =
      roomId === 59 ? 20 : roomId === 60 ? 15 : roomId === 61 ? 10 : 10;
    const seatSpacing = 36;
    const rowSpacing = 45;
    const centerOffset = (seatsPerRow * seatSpacing) / 2;

    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        let seatTypeId = 1; // Standard
        if (
          (roomId === 59 && rowIndex === 2 && (i <= 2 || i >= 19)) ||
          (roomId === 60 && rowIndex === 2 && (i <= 2 || i >= 14)) ||
          (roomId === 61 && rowIndex === 1 && (i <= 2 || i >= 9)) ||
          (roomId === 62 && rowIndex === 1 && (i <= 2 || i >= 9))
        ) {
          seatTypeId = 4; // Accessible
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
      <div className="max-w-7xl mx-auto p-6 flex-1">
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

        <div className="pb-6 mb-8">
          <div
            className="relative border border-gray-700 rounded-lg p-4 bg-gray-800 mx-auto shadow-lg shadow-indigo-950/50 flex justify-center items-center"
            style={{
              width: "900px",
              maxWidth: "100%",
              height: "600px",
            }}
          >
            <div
              className="relative"
              style={{
                width: "720px",
                height: "455px",
              }}
            >
              {seats.map((seat) => (
                <button
                  key={seat.id}
                  className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300
                    ${
                      !seat.isAvailable
                        ? "bg-red-600 cursor-not-allowed opacity-70"
                        : selectedSeats.some((s) => s.id === seat.id)
                        ? "bg-green-600 text-white scale-110 shadow-md"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 hover:shadow-md"
                    }
                    ${seat.seatTypeId === 4 ? "ring-2 ring-blue-400" : ""}`}
                  style={{
                    left: `calc(50% + ${seat.xPosition}px)`,
                    top: `calc(${seat.yPosition}px - 25%)`,
                    transform: "translateX(-100%)",
                  }}
                  onClick={() => handleSeatClick(seat)}
                  disabled={!seat.isAvailable}
                  aria-label={`Seat ${seat.row}${seat.seatNumber}`}
                >
                  {seat.row}
                  {seat.seatNumber}
                </button>
              ))}
            </div>
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
                      {seat.seatTypeId === 1 ? "Standard" : "Accessible"}
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
            <div className="w-5 h-5 bg-green-600 rounded-full ring-3 ring-blue-400"></div>
            <span className="text-sm text-gray-300">Accessible</span>
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
