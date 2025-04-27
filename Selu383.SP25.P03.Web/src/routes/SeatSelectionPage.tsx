import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@headlessui/react";
import { ArrowLeftIcon, TicketIcon } from "@heroicons/react/24/outline";
import { SeatService, SeatTypeService } from "../Services/SeatService";
import { useCart } from "../components/CartContext";
import axios from "axios";

interface Seat {
  id: number;
  seatTypeId: number;
  roomId: number;
  isAvailable: boolean;
  row: string;
  number: number;
}

interface SeatType {
  id: number;
  name: string;
  price: number;
  color: string;
}

interface SeatReservation {
  id: number;
  seatId: number;
  theaterId: number;
  roomId: number;
  movieScheduleId: number;
  isReserved: boolean;
}

interface Movie {
  id: number;
  title: string;
  runtime: number;
  ageRating: string;
}

interface Theater {
  id: number;
  name: string;
}

export default function SeatSelection() {
  const { addToCart } = useCart();
  const { movieId, theaterId, roomId, scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { time, movie, theater, poster } = location.state as {
    time: string;
    movie: Movie;
    theater: Theater;
    poster?: { imageType: string; imageData: string };
  };

  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [reservedSeats, setReservedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId || !theaterId || !roomId || !scheduleId || !movie) {
      setError("Invalid selection parameters");
      navigate("/movies");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        const [seatTypesResponse, seatsResponse] = await Promise.all([
          SeatTypeService.getAll(),
          SeatService.getByRoomId(Number(roomId)),
        ]);

        const reservationsResponse = await axios.get<SeatReservation[]>(
          `/api/SeatReservations/ForShowing/${theaterId}/${scheduleId}/${roomId}`
        );

        setSeatTypes(seatTypesResponse);
        setSeats(seatsResponse);
        setReservedSeats(reservationsResponse.data.map((r) => r.seatId));
      } catch (err) {
        console.error("Failed to load seat data:", err);
        setError("Failed to load seat information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId, theaterId, roomId, scheduleId, movie, navigate]);

  const handleSeatClick = async (seat: Seat) => {
    if (!seat.isAvailable || reservedSeats.includes(seat.id)) {
      setError(`Seat ${seat.row}${seat.number} is not available`);
      return;
    }

    try {
      const response = await axios.post<SeatReservation>(
        "/api/SeatReservations",
        {
          theaterId: Number(theaterId),
          movieScheduleId: Number(scheduleId),
          roomId: Number(roomId),
          seatId: seat.id,
          isReserved: true,
        }
      );

      if (response.status === 201) {
        setSelectedSeats([...selectedSeats, seat]);
        setReservedSeats([...reservedSeats, seat.id]);
      }
    } catch (err: any) {
      console.error("Reservation failed:", err.response?.data);
      setError(err.response?.data?.message || "Failed to reserve seat");
    }
  };

  const handleUnselectSeat = async (seatId: number) => {
    try {
      await axios.delete(
        `/api/SeatReservations/${theaterId}/${scheduleId}/${roomId}/${seatId}`
      );
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seatId));
      setReservedSeats(reservedSeats.filter((id) => id !== seatId));
    } catch (err) {
      setError("Failed to release seat reservation");
    }
  };

  const handleCheckout = () => {
    selectedSeats.forEach((seat) => {
      const seatType = seatTypes.find((st) => st.id === seat.seatTypeId);
      addToCart({
        id: seat.id,
        name: `${seat.row}${seat.number}`,
        price: seatType?.price || 0,
        quantity: 1,
        type: "seat",
        seatType: seatType?.name || "Standard",
        showtime: {
          id: Number(scheduleId),
          time,
          movieId: movie.id,
          theaterId: theater.id,
          roomId: Number(roomId),
        },
        movie: {
          id: movie.id,
          title: movie.title,
          runtime: movie.runtime,
          ageRating: movie.ageRating,
          poster: poster,
        },
      });
    });
    navigate("/checkout");
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable) return "bg-gray-600";
    if (reservedSeats.includes(seat.id)) return "bg-red-500";
    if (selectedSeats.some((s) => s.id === seat.id)) return "bg-green-500";
    return (
      seatTypes.find((st) => st.id === seat.seatTypeId)?.color || "bg-blue-500"
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-500 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Showtimes
      </Button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Select Your Seats
        </h1>
        <p className="text-lg text-gray-600">
          {movie.title} • {theater.name} • {new Date(time).toLocaleString()}
        </p>
      </div>

      {/* Screen Display */}
      <div className="bg-gray-200 text-center py-4 mb-8 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold">SCREEN</h2>
      </div>

      {/* Seat Map */}
      <div className="flex justify-center mb-12">
        <div className="grid gap-2">
          {Array.from(new Set(seats.map((s) => s.row)))
            .sort()
            .map((row) => (
              <div key={row} className="flex gap-2 justify-center">
                <div className="w-8 flex items-center justify-center font-medium">
                  {row}
                </div>
                {seats
                  .filter((seat) => seat.row === row)
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => (
                    <button
                      key={`${row}-${seat.number}`}
                      className={`w-10 h-10 rounded flex items-center justify-center text-white ${getSeatColor(
                        seat
                      )} 
                      ${
                        seat.isAvailable && !reservedSeats.includes(seat.id)
                          ? "hover:opacity-80 cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                      onClick={() => handleSeatClick(seat)}
                      disabled={
                        !seat.isAvailable || reservedSeats.includes(seat.id)
                      }
                      aria-label={`Seat ${row}${seat.number}`}
                    >
                      {seat.number}
                    </button>
                  ))}
              </div>
            ))}
        </div>
      </div>

      {/* Selected Seats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Your Selection ({selectedSeats.length})
        </h3>

        {selectedSeats.length > 0 ? (
          <>
            <ul className="space-y-2 mb-6">
              {selectedSeats.map((seat) => {
                const seatType = seatTypes.find(
                  (st) => st.id === seat.seatTypeId
                );
                return (
                  <li
                    key={seat.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span>
                      {seat.row}
                      {seat.number} - {seatType?.name} ($
                      {seatType?.price.toFixed(2)})
                    </span>
                    <button
                      onClick={() => handleUnselectSeat(seat.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>

            <Button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <TicketIcon className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <p className="text-gray-500">No seats selected yet</p>
        )}
      </div>

      {/* Seat Type Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {seatTypes.map((type) => (
          <div key={type.id} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${type.color}`}></div>
            <span>
              {type.name} (${type.price.toFixed(2)})
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-red-500"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-green-500"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-600"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
