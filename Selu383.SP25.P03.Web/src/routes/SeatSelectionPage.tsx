import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@headlessui/react";
import { ArrowLeftIcon, TicketIcon } from "@heroicons/react/24/outline";
import { SeatService, SeatTypeService } from "../Services/SeatService";
import { useCart } from "../components/CartContext";
import { getSeatPrice, getSeatTypeName } from "../Utils/seats";
import axios from "axios";

interface Seat {
  id: number;
  seatTypeId: number;
  roomsId: number;
  isAvailable: boolean;
  row: string;
  seatNumber: number;
}

interface SeatType {
  id: number;
  seatTypes: string;
}

interface SeatTaken {
  id: number;
  seatTypeId: number;
  roomsId: number;
  theaterId: number;
  movieScheduleId: number;
  isTaken: boolean;
}

export default function SeatSelection() {
  const { addToCart } = useCart();
  const { movieId, theaterId, roomId, scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { time, movie, theater, poster } = location.state || {};

  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [reservedSeats, setReservedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seatTypeColors] = useState<Record<number, string>>({
    1: "bg-indigo-600",
    2: "bg-purple-600",
    3: "bg-amber-600",
    4: "bg-indigo-600 ring-3 ring-blue-400",
  });

  useEffect(() => {
    if (!movieId || !theaterId || !roomId || !scheduleId || !movie) {
      console.warn("Missing required parameters:", {
        movieId,
        theaterId,
        roomId,
        scheduleId,
        movie,
      });
      setError("Invalid movie, theater, room, or schedule selection.");
      navigate(-1);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching data with parameters:", {
          movieId,
          theaterId,
          roomId,
          scheduleId,
        });

        // Step 1: Fetch types and seatsData
        const [types, seatsData]: [SeatType[], Seat[]] = await Promise.all([
          SeatTypeService.getAll().catch((err) => {
            console.error("SeatTypeService.getAll failed:", err);
            return [];
          }),
          SeatService.getByRoomId(Number(roomId)).catch((err) => {
            console.error("SeatService.getByRoomId failed:", err);
            return [];
          }),
        ]);

        // Step 2: Fetch reserved seats based on seatsData
        const reservedSeatsData = await Promise.all(
          seatsData.length > 0
            ? seatsData.map((seat: Seat) =>
                axios
                  .get(
                    `/api/SeatTaken/GetBySchedule/${theaterId}/${scheduleId}/${roomId}/${seat.id}`
                  )
                  .catch((err) => {
                    console.error(
                      `SeatTaken API failed for seat ${seat.id}:`,
                      err
                    );
                    return { data: [] };
                  })
              )
            : [Promise.resolve({ data: [] })]
        );

        console.log("Data received:", { types, seatsData, reservedSeatsData });

        setSeatTypes(types);
        setSeats(seatsData);

        // Flatten reserved seats from multiple API calls
        const reserved = reservedSeatsData
          .flatMap((response: any) => response.data)
          .filter((seat: SeatTaken) => seat.isTaken)
          .map((seat: SeatTaken) => seat.seatTypeId);
        setReservedSeats(reserved);

        if (seatsData.length === 0) {
          setError("No seats found for this room.");
        } else if (!types.length) {
          setError("No seat types found.");
        }

        console.log(
          "Seats availability:",
          seatsData.map((s) => ({
            id: s.id,
            row: s.row,
            seatNumber: s.seatNumber,
            isAvailable: s.isAvailable,
          }))
        );
        console.log("Reserved seats:", reserved);

        if (seatsData.every((s) => !s.isAvailable)) {
          console.warn("No seats are available in this room.");
          setError("All seats in this room are unavailable.");
        }
      } catch (err) {
        console.error("Fetch data error:", err);
        setError(
          `Failed to load seat data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, theaterId, roomId, scheduleId, movie, navigate]);

  const calculateSeatLayout = () => {
    if (seats.length === 0) return null;

    const BASE_SEAT_COUNT = 50;
    const BASE_CONTAINER_WIDTH = 800;
    const BASE_SEAT_SIZE = 24;
    const BASE_GAP_SIZE = 8;
    const BASE_PADDING = 40;

    const uniqueRows = [...new Set(seats.map((seat) => seat.row))].sort(
      (a, b) => a.localeCompare(b, undefined, { numeric: true })
    );

    const seatsByRow = uniqueRows.map((row) =>
      seats
        .filter((seat) => seat.row === row)
        .sort((a, b) => a.seatNumber - b.seatNumber)
    );

    const maxSeatsPerRow = Math.max(...seatsByRow.map((row) => row.length));
    const totalSeats = seats.length;

    const scaleFactor = Math.max(
      1,
      Math.pow(totalSeats / BASE_SEAT_COUNT, 1 / 3)
    );

    const seatSize = Math.min(36, BASE_SEAT_SIZE * scaleFactor);
    const gapSize = Math.min(12, BASE_GAP_SIZE * scaleFactor);
    const padding = Math.min(60, BASE_PADDING * scaleFactor);

    const gridWidth = maxSeatsPerRow * (seatSize + gapSize) - gapSize;
    const gridHeight = uniqueRows.length * (seatSize + gapSize) - gapSize;

    const containerWidth = Math.min(
      window.innerWidth * 0.95,
      Math.max(BASE_CONTAINER_WIDTH, gridWidth + padding * 2)
    );
    const containerHeight = gridHeight + padding * 2;

    const availableWidth = containerWidth - padding * 2;
    const startX = padding + Math.max(0, (availableWidth - gridWidth) / 2);
    const startY = padding;

    return {
      containerWidth,
      containerHeight,
      seatSize,
      gapSize,
      startX,
      startY,
      uniqueRows,
      seatsByRow,
      padding,
      scaleFactor,
    };
  };

  const handleSeatClick = async (seat: Seat) => {
    console.log("Attempting to select seat:", {
      id: seat.id,
      row: seat.row,
      seatNumber: seat.seatNumber,
      isAvailable: seat.isAvailable,
      isReserved: reservedSeats.includes(seat.id),
    });

    if (!seat.isAvailable) {
      console.warn("Seat is unavailable:", seat.id);
      setError(`Seat ${seat.row}${seat.seatNumber} is unavailable.`);
      return;
    }

    if (reservedSeats.includes(seat.id)) {
      console.warn("Seat is already reserved:", seat.id);
      setError(`Seat ${seat.row}${seat.seatNumber} is already reserved.`);
      return;
    }

    try {
      const payload = {
        theaterId: Number(theaterId),
        movieScheduleId: Number(scheduleId),
        roomsId: Number(roomId),
        seatTypeId: seat.id,
        isTaken: true,
      };
      console.log("Sending POST to /api/SeatTaken with payload:", payload);

      // Retry logic: attempt the POST up to 3 times
      let attempts = 0;
      const maxAttempts = 3;
      let response;
      while (attempts < maxAttempts) {
        try {
          response = await axios.post(`/api/SeatTaken`, payload, {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000, // 5s timeout
          });
          console.log("POST /api/SeatTaken response:", response.data);
          break;
        } catch (retryErr: any) {
          attempts++;
          console.warn(`Attempt ${attempts} failed:`, {
            message: retryErr.message,
            response: retryErr.response
              ? {
                  status: retryErr.response.status,
                  data: retryErr.response.data,
                }
              : null,
          });
          if (attempts === maxAttempts) throw retryErr;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
        }
      }

      setSelectedSeats((prev) => [...prev, seat]);
      setReservedSeats((prev) => [...prev, seat.id]);
    } catch (err: any) {
      console.error("Failed to reserve seat:", {
        message: err.message,
        code: err.code,
        response: err.response
          ? {
              status: err.response.status,
              data: err.response.data,
            }
          : null,
      });
      const errorMessage =
        err.response?.status === 500
          ? `Failed to reserve seat ${seat.row}${
              seat.seatNumber
            }: Server error - ${
              err.response?.data?.message || "Unknown error"
            }. Please try again or contact support.`
          : `Failed to reserve seat ${seat.row}${seat.seatNumber}: ${err.message}`;
      setError(errorMessage);
    }
  };

  const handleSeatUnselect = async (seatId: number) => {
    console.log("Attempting to unselect seat:", seatId);

    try {
      await axios.delete(
        `/api/SeatTaken/${theaterId}/${scheduleId}/${roomId}/${seatId}`
      );
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
      setReservedSeats((prev) => prev.filter((id) => id !== seatId));
    } catch (err) {
      console.error("Failed to release seat:", err);
      setError(
        `Failed to release seat: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleCheckout = () => {
    selectedSeats.forEach((seat) => {
      addToCart({
        id: seat.id,
        name: `${seat.row}${seat.seatNumber}`,
        price: getSeatPrice(seat.seatTypeId),
        quantity: 1,
        type: "seat",
        row: seat.row,
        seatNumber: seat.seatNumber,
        seatTypeId: seat.seatTypeId,
        showtime: { id: Number(scheduleId), time },
        movie: {
          id: movie.id,
          title: movie.title,
          runtime: movie.runtime,
          ageRating: movie.ageRating,
        },
        theater: {
          id: theater.id,
          name: theater.name,
        },
        poster: poster
          ? { imageType: poster.imageType, imageData: poster.imageData }
          : undefined,
      });
    });
    navigate("/checkout", {
      state: {
        selectedSeats,
        showtime: { id: Number(scheduleId), time },
        movie,
        theater,
        poster,
      },
    });
  };

  const currentYear = new Date().getFullYear();
  const layout = calculateSeatLayout();

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
      <div className="max-w-[95vw] mx-auto p-6 flex-1 w-full">
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
            </div>
            <button
              onClick={() => setError(null)}
              className="bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-300 mb-1 drop-shadow-lg">
            Select Your Seats
          </h1>
          <p className="text-lg text-gray-300">
            {movie?.title} • {theater?.name} •{" "}
            {new Date(time).toLocaleString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {layout && (
          <div
            className="bg-gradient-to-t from-indigo-950 to-gray-800 text-white text-center py-6 mb-8 rounded-lg shadow-lg shadow-indigo-950/50 mx-auto"
            style={{
              width: `${layout.containerWidth}px`,
              maxWidth: "95vw",
            }}
          >
            <h2 className="text-xl font-bold text-indigo-200 drop-shadow-md">
              SCREEN
            </h2>
          </div>
        )}

        {!layout ? (
          <div className="text-center py-12">
            <p className="text-indigo-300">No seating information available</p>
          </div>
        ) : (
          <>
            <div className="pb-6 mb-8 flex justify-center overflow-auto">
              <div
                className="relative border border-gray-700 rounded-lg bg-gray-800 shadow-lg shadow-indigo-950/50 mx-auto"
                style={{
                  width: `${layout.containerWidth}px`,
                  height: `${layout.containerHeight}px`,
                  minWidth: "800px",
                  minHeight: "500px",
                }}
              >
                {layout.uniqueRows.map((row, rowIndex) => (
                  <div
                    key={row}
                    className="absolute w-full"
                    style={{
                      top: `${
                        layout.startY +
                        rowIndex * (layout.seatSize + layout.gapSize)
                      }px`,
                      height: `${layout.seatSize}px`,
                    }}
                  >
                    {layout.seatsByRow[rowIndex].map((seat) => (
                      <button
                        key={seat.id}
                        className={`absolute rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                          ${
                            !seat.isAvailable
                              ? "bg-red-600 cursor-not-allowed opacity-70"
                              : reservedSeats.includes(seat.id)
                              ? "bg-yellow-500 text-white"
                              : selectedSeats.some((s) => s.id === seat.id)
                              ? "bg-green-600 text-white scale-110 shadow-md"
                              : seatTypeColors[seat.seatTypeId] ||
                                "bg-indigo-600"
                          }
                          text-white hover:scale-105 hover:shadow-md`}
                        style={{
                          width: `${layout.seatSize}px`,
                          height: `${layout.seatSize}px`,
                          left: `${
                            layout.startX +
                            (seat.seatNumber - 1) *
                              (layout.seatSize + layout.gapSize)
                          }px`,
                          fontSize: `${Math.max(10, layout.seatSize * 0.4)}px`,
                        }}
                        onClick={() => handleSeatClick(seat)}
                        disabled={
                          !seat.isAvailable || reservedSeats.includes(seat.id)
                        }
                        aria-label={`Seat ${seat.row}${seat.seatNumber}`}
                      >
                        {seat.row}
                        {seat.seatNumber}
                      </button>
                    ))}
                  </div>
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
                          {getSeatTypeName(seat.seatTypeId)}
                        </span>
                        <button
                          onClick={() => handleSeatUnselect(seat.id)}
                          className="text-red-400 hover:text-red-300 text-xs mt-1"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Proceed to Checkout
                    <TicketIcon className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-300">Select seats to continue</p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {seatTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full ${
                  seatTypeColors[type.id] || "bg-gray-600"
                }`}
              ></div>
              <span className="text-sm text-gray-300">{type.seatTypes}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Selected</span>
          </div>
        </div>
      </div>

      <footer className="w-full bg-indigo-950 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
