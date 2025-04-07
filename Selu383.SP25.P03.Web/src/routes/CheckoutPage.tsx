import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

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

interface Showtime {
  id: number;
  time: string;
  movieId: number;
}

interface Theater {
  id: number;
  name: string;
  location?: string;
}

interface Movie {
  id: number;
  title: string;
  runtime: number;
  ageRating: string;
  posterUrl?: string;
  description?: string;
  releaseDate?: string;
  category?: string;
}

interface MoviePoster {
  imageType: string;
  imageData: string;
  name: string;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, showtime, theater, movie, poster } =
    location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    console.log("location.state:", location.state);
    if (!showtime || !theater || !selectedSeats?.length || !movie) {
      setError("Please select a movie, theater, showtime, and seats first.");
    }
  }, [showtime, theater, selectedSeats, movie]);

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOrderComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const getSeatType = (seatTypeId: number) => {
    switch (seatTypeId) {
      case 1:
        return "Standard";
      case 2:
        return "Premium";
      case 3:
        return "Recliner";
      case 4:
        return "Accessible";
      case 5:
        return "VIP";
      default:
        return "Unknown";
    }
  };

  const getSeatPrice = (seatTypeId: number) => {
    switch (seatTypeId) {
      case 1:
        return 8;
      case 2:
        return 12;
      case 3:
        return 14;
      case 4:
        return 8;
      case 5:
        return 20;
      default:
        return 0;
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce(
      (total: number, seat: Seat) => total + getSeatPrice(seat.seatTypeId),
      0
    );
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!showtime || !theater || !selectedSeats?.length || !movie) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-500">
        <p>{error}</p>
        <Button
          onClick={() => navigate("/")}
          className="mt-4 bg-indigo-600! hover:bg-indigo-700! text-white py-3 px-6 rounded-lg"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">
          Order Complete!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your tickets for <span className="font-bold">{movie.title}</span> have
          been purchased.
        </p>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-left">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Movie:</span>
              <span className="font-medium">{movie.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Theater:</span>
              <span className="font-medium">{theater.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Showtime:</span>
              <span className="font-medium">
                {new Date(showtime.time).toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-4">
              {selectedSeats.map((seat: Seat) => (
                <div key={seat.id} className="flex justify-between mb-2">
                  <span>
                    Seat {seat.row}
                    {seat.seatNumber} ({getSeatType(seat.seatTypeId)})
                  </span>
                  <span>${getSeatPrice(seat.seatTypeId)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t pt-4 font-bold text-lg">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.print()}
            className="bg-indigo-600! hover:bg-indigo-700! text-white px-6 py-3 rounded-lg"
          >
            Print Tickets
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-white border border-indigo-600! text-indigo-600! hover:bg-indigo-50 px-6 py-3 rounded-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 mb-6 hover:text-indigo-800 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to seat selection
      </Button>

      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Checkout</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">
            Order Summary
          </h2>

          <div className="flex gap-4 mb-6">
            <div className="flex-shrink-0">
              {poster ? (
                <img
                  src={`data:${poster.imageType};base64,${poster.imageData}`}
                  alt={movie.title}
                  className="w-24 h-auto rounded"
                />
              ) : (
                <img
                  src="/placeholder-poster.jpg"
                  alt={movie.title}
                  className="w-24 h-auto rounded"
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{movie.title}</h3>
              <p className="text-gray-600">
                {movie.runtime} min • {movie.ageRating}
              </p>
              <p className="text-indigo-600 font-medium mt-2">{theater.name}</p>
              <p className="text-gray-700">
                {new Date(showtime.time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">
              Selected Seats ({selectedSeats.length})
            </h3>
            <ul className="space-y-2">
              {selectedSeats.map((seat: Seat) => (
                <li key={seat.id} className="flex justify-between">
                  <span>
                    Seat {seat.row}
                    {seat.seatNumber} ({getSeatType(seat.seatTypeId)})
                  </span>
                  <span>${getSeatPrice(seat.seatTypeId)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">
            Payment Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Name on Card</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <Button
              onClick={handlePayment}
              disabled={paymentProcessing}
              className="w-full bg-indigo-600! hover:bg-indigo-700! text-white py-3 rounded-lg font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentProcessing ? "Processing..." : "Complete Purchase"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
