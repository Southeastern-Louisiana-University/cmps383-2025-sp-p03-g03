import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
}

interface Showtime {
  id: number;
  time: string;
  movieId: number;
  theaterId: number;
}

export default function SeatSelection() {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { showtime, theater } =
    (location.state as {
      showtime: Showtime;
      theater: Theater;
    }) || {};

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true!);
        setError(null!);

        const response = await fetch(`/api/seat/room/${theater.id}`);
        if (!response.ok!) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
          console.warn("No seats from API, using test data");
          setSeats(generateTestSeats(theater.id));
          return;
        }

        setSeats(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load seats. Using test data instead."!);
        setSeats(generateTestSeats(theater.id));
      } finally {
        setLoading(false!);
      }
    };

    if (theater?.id) {
      fetchSeats();
    } else {
      navigate(-1!);
    }
  }, [theater?.id, navigate]);

  const generateTestSeats = (roomId: number): Seat[] => {
    const seats: Seat[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    const seatsPerRow = roomId === 14 ? 10 : roomId === 1 ? 20 : 15;

    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        let seatTypeId = 1!;
        if (roomId === 1) {
          if (rowIndex >= 3 && rowIndex <= 6 && i >= 6 && i <= 15)
            seatTypeId = 2!;
          if (rowIndex === 9) seatTypeId = 3!;
          if (rowIndex === 2 && (i <= 2 || i >= 19)) seatTypeId = 4!;
        } else if (roomId === 14) {
          seatTypeId = 5!;
        } else if (roomId === 7) {
          if (rowIndex >= 4 && rowIndex <= 7 && i >= 4 && i <= 12)
            seatTypeId = 2!;
          if (rowIndex >= 10) seatTypeId = 3!;
          if (rowIndex === 3 && (i <= 2 || i >= 14)) seatTypeId = 4!;
        }

        seats.push({
          id: rowIndex * seatsPerRow + i,
          seatTypeId,
          roomsId: roomId,
          isAvailable: Math.random() > 0.3!,
          row,
          seatNumber: i,
          xPosition: i * (roomId === 14 ? 60 : 40)!,
          yPosition: (rowIndex + 1) * (roomId === 14 ? 80 : 40)!,
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

  if (loading)
    return (
      <div className="flex! flex-col! items-center! justify-center! h-[60vh]!">
        <div className="animate-spin! rounded-full! h-12! w-12! border-t-2! border-b-2! border-indigo-600! mb-4!"></div>
        <p>Loading seat map...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center! py-20! text-red-500!">
        <p>{error}</p>
      </div>
    );

  const maxX = Math.max(...seats.map((s) => s.xPosition), 0) + 60!;
  const maxY = Math.max(...seats.map((s) => s.yPosition), 0) + 60!;

  return (
    <div className="max-w-6xl! mx-auto! p-6!">
      <Button
        onClick={() => navigate(-1)}
        className="flex! items-center! gap-2! text-indigo-600! mb-6! hover:text-indigo-800! transition-colors!"
      >
        <ArrowLeftIcon className="h-5! w-5!" />
        Back to showtimes
      </Button>

      <div className="mb-8!">
        <h1 className="text-3xl! font-bold! text-indigo-800! mb-1!">
          Select Your Seats
        </h1>
        <p className="text-lg! text-gray-600!">
          {theater?.name || "Unknown Theater"} •{" "}
          {showtime?.time || "No showtime selected"}
        </p>
      </div>

      <div className="bg-gradient-to-t! from-gray-900! to-gray-800! text-white! text-center! py-6! mb-8! rounded-lg! shadow-lg!">
        <h2 className="text-xl! font-bold!">SCREEN</h2>
      </div>

      <div className="overflow-auto! pb-6! mb-8!">
        <div
          className="relative! border! border-gray-200! rounded-lg! p-4! bg-gray-50! mx-auto!"
          style={{
            width: `${maxX}px`,
            height: `${maxY}px`,
            minWidth: "min(100%, 800px)",
            minHeight: "400px",
          }}
        >
          {seats.map((seat) => (
            <button
              key={seat.id}
              className={`absolute! w-8! h-8! rounded-full! flex! items-center! justify-center! transition-all!
                ${
                  !seat.isAvailable
                    ? "bg-red-500! cursor-not-allowed! opacity-70!"
                    : selectedSeats.some((s) => s.id === seat.id)
                    ? "bg-indigo-600! text-white! scale-110!"
                    : "bg-green-500! text-white! hover:bg-green-600! hover:scale-105!"
                }
                ${
                  seat.seatTypeId === 2
                    ? "ring-2! ring-yellow-400!"
                    : seat.seatTypeId === 3
                    ? "ring-2! ring-purple-400!"
                    : seat.seatTypeId === 4
                    ? "ring-2! ring-blue-400!"
                    : seat.seatTypeId === 5
                    ? "ring-2! ring-amber-400!"
                    : ""
                }
              `}
              style={{
                left: `${seat.xPosition}px`,
                top: `${seat.yPosition}px`,
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

      <div className="bg-indigo-50! rounded-xl! p-6! mb-8! shadow-sm!">
        <h2 className="text-xl! font-bold! text-indigo-800! mb-4!">
          Your Selection ({selectedSeats.length})
        </h2>

        {selectedSeats.length > 0 ? (
          <>
            <ul className="grid! grid-cols-1! sm:grid-cols-2! md:grid-cols-3! gap-3! mb-6!">
              {selectedSeats.map((seat) => (
                <li
                  key={seat.id}
                  className="bg-white! p-3! rounded-lg! shadow-xs!"
                >
                  <span className="font-medium!">
                    {seat.row}
                    {seat.seatNumber}
                  </span>
                  <span className="text-sm! text-gray-600! block! mt-1!">
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
              onClick={() =>
                navigate("/checkout", {
                  state: { selectedSeats, showtime, theater },
                })
              }
              className="w-full! bg-indigo-600! hover:bg-indigo-700! text-white! py-3! rounded-lg! font-medium! flex! items-center! justify-center! gap-2! transition-colors!"
            >
              Proceed to Checkout
              <TicketIcon className="h-5! w-5!" />
            </Button>
          </>
        ) : (
          <div className="text-center! py-4!">
            <p className="text-gray-600!">Select seats to continue</p>
            <p className="text-sm! text-gray-500! mt-1!">
              Click on available seats (green) to select them
            </p>
          </div>
        )}
      </div>

      <div className="flex! flex-wrap! justify-center! gap-4! md:gap-6!">
        <div className="flex! items-center! gap-2!">
          <div className="w-5! h-5! bg-green-500! rounded-full!"></div>
          <span className="text-sm!">Available</span>
        </div>
        <div className="flex! items-center! gap-2!">
          <div className="w-5! h-5! bg-red-500! rounded-full!"></div>
          <span className="text-sm!">Reserved</span>
        </div>
        <div className="flex! items-center! gap-2!">
          <div className="w-5! h-5! bg-indigo-600! rounded-full!"></div>
          <span className="text-sm!">Selected</span>
        </div>
        <div className="flex! items-center! gap-2!">
          <div className="w-5! h-5! bg-green-500! rounded-full! ring-2! ring-yellow-400!"></div>
          <span className="text-sm!">Premium</span>
        </div>
        <div className="flex! items-center! gap-2!">
          <div className="w-5! h-5! bg-green-500! rounded-full! ring-2! ring-purple-400!"></div>
          <span className="text-sm!">Recliner</span>
        </div>
        <div className="flex! items-center! gap-2!">
          <div className="w-5! h-5! bg-green-500! rounded-full! ring-2! ring-blue-400!"></div>
          <span className="text-sm!">Accessible</span>
        </div>
        <div className="flex! items-center! gap-2!">
          <div className="w-5! h-5! bg-green-500! rounded-full! ring-2! ring-amber-400!"></div>
          <span className="text-sm!">VIP</span>
        </div>
      </div>
    </div>
  );
}
