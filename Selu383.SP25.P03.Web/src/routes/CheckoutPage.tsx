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

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, showtime, theater, movie, poster } =
    location.state || {};
  const [error, setError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
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

  const currentYear = new Date().getFullYear();

  if (!showtime || !theater || !selectedSeats?.length || !movie) {
    return (
      <div className="flex! flex-col! min-h-screen! bg-gray-900! text-white!">
        <div className="max-w-4xl! mx-auto! p-6! text-center! text-red-500! flex-1! flex! items-center! justify-center!">
          <div>
            <p>{error}</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4! bg-indigo-700! hover:bg-indigo-600! text-white! py-3! px-6! rounded-lg! transition-all! duration-300! shadow-md! hover:shadow-lg!"
            >
              Return to Home
            </Button>
          </div>
        </div>
        <footer className="w-full! bg-indigo-950! text-white! py-6!">
          <div className="container! mx-auto! px-4! text-center!">
            <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
            <div className="mt-2! space-x-4!">
              <a href="/terms" className="hover:text-indigo-300!">
                Terms
              </a>
              <a href="/privacy" className="hover:text-indigo-300!">
                Privacy
              </a>
              <a href="/contact" className="hover:text-indigo-300!">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="flex! flex-col! min-h-screen! bg-gray-900! text-white!">
        <div className="max-w-2xl! mx-auto! p-6! text-center! flex-1! flex! flex-col! justify-center!">
          <CheckCircleIcon className="h-20! w-20! text-green-500! mx-auto! mb-6!" />
          <h1 className="text-3xl! font-extrabold! text-indigo-300! mb-4! drop-shadow-lg!">
            Order Complete!
          </h1>
          <p className="text-xl! text-gray-300! mb-8!">
            Your tickets for{" "}
            <span className="font-bold! text-indigo-200!">{movie.title}</span>{" "}
            have been purchased.
          </p>

          <div className="bg-gray-800! rounded-xl! shadow-lg! shadow-indigo-950/50! p-6! mb-8! text-left!">
            <h2 className="text-xl! font-extrabold! text-indigo-300! mb-4! drop-shadow-lg!">
              Order Summary
            </h2>
            <div className="space-y-4!">
              <div className="flex! justify-between!">
                <span className="text-gray-300!">Movie:</span>
                <span className="font-medium! text-indigo-200!">
                  {movie.title}
                </span>
              </div>
              <div className="flex! justify-between!">
                <span className="text-gray-300!">Theater:</span>
                <span className="font-medium! text-indigo-200!">
                  {theater.name}
                </span>
              </div>
              <div className="flex! justify-between!">
                <span className="text-gray-300!">Showtime:</span>
                <span className="font-medium! text-indigo-200!">
                  {new Date(showtime.time).toLocaleString()}
                </span>
              </div>
              <div className="border-t! border-gray-700! pt-4!">
                {selectedSeats.map((seat: Seat) => (
                  <div
                    key={seat.id}
                    className="flex! justify-between! mb-2! text-gray-300!"
                  >
                    <span>
                      Seat {seat.row}
                      {seat.seatNumber} ({getSeatType(seat.seatTypeId)})
                    </span>
                    <span>${getSeatPrice(seat.seatTypeId)}</span>
                  </div>
                ))}
              </div>
              <div className="flex! justify-between! border-t! border-gray-700! pt-4! font-bold! text-lg! text-indigo-200!">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>

          <div className="flex! flex-col! sm:flex-row! gap-4! justify-center!">
            <Button
              onClick={() => window.print()}
              className="bg-indigo-700! hover:bg-indigo-600! text-white! px-6! py-3! rounded-lg! transition-all! duration-300! shadow-md! hover:shadow-lg!"
            >
              Print Tickets
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="bg-gray-700! border! border-indigo-600! text-indigo-300! hover:bg-gray-600! px-6! py-3! rounded-lg! transition-all! duration-300!"
            >
              Back to Home
            </Button>
          </div>
        </div>

        <footer className="w-full! bg-indigo-950! text-white! py-6!">
          <div className="container! mx-auto! px-4! text-center!">
            <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
            <div className="mt-2! space-x-4!">
              <a href="/terms" className="hover:text-indigo-300!">
                Terms
              </a>
              <a href="/privacy" className="hover:text-indigo-300!">
                Privacy
              </a>
              <a href="/contact" className="hover:text-indigo-300!">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex! flex-col! min-h-screen! bg-gray-900! text-white!">
      <div className="max-w-4xl! mx-auto! p-6! flex-1!">
        <Button
          onClick={() => navigate(-1)}
          className="flex! items-center! gap-2! text-indigo-400! mb-6! hover:text-indigo-300! transition-colors! duration-300!"
        >
          <ArrowLeftIcon className="h-5! w-5!" />
          Back to seat selection
        </Button>

        <h1 className="text-3xl! font-extrabold! text-indigo-300! mb-6! drop-shadow-lg!">
          Checkout
        </h1>
        {error && (
          <div className="mb-4! p-3! bg-red-900! text-red-300! rounded-lg!">
            {error}
          </div>
        )}

        <div className="grid! md:grid-cols-3! gap-8!">
          <div className="md:col-span-2! bg-gray-800! rounded-xl! shadow-lg! shadow-indigo-950/50! p-6!">
            <h2 className="text-xl! font-extrabold! text-indigo-300! mb-4! drop-shadow-lg!">
              Order Summary
            </h2>

            <div className="flex! gap-4! mb-6!">
              <div className="flex-shrink-0!">
                {poster ? (
                  <img
                    src={`data:${poster.imageType};base64,${poster.imageData}`}
                    alt={movie.title}
                    className="w-24! h-auto! rounded-lg! shadow-md! shadow-indigo-950/50!"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src="/placeholder-poster.jpg"
                    alt={movie.title}
                    className="w-24! h-auto! rounded-lg! shadow-md! shadow-indigo-950/50!"
                    loading="lazy"
                  />
                )}
              </div>
              <div>
                <h3 className="text-lg! font-bold! text-indigo-200!">
                  {movie.title}
                </h3>
                <p className="text-gray-300!">
                  {movie.runtime} min • {movie.ageRating}
                </p>
                <p className="text-indigo-400! font-medium! mt-2!">
                  {theater.name}
                </p>
                <p className="text-gray-300!">
                  {new Date(showtime.time).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border-t! border-gray-700! pt-4!">
              <h3 className="font-bold! mb-2! text-indigo-200!">
                Selected Seats ({selectedSeats.length})
              </h3>
              <ul className="space-y-2! text-gray-300!">
                {selectedSeats.map((seat: Seat) => (
                  <li key={seat.id} className="flex! justify-between!">
                    <span>
                      Seat {seat.row}
                      {seat.seatNumber} ({getSeatType(seat.seatTypeId)})
                    </span>
                    <span>${getSeatPrice(seat.seatTypeId)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t! border-gray-700! pt-4! mt-4! flex! justify-between! font-bold! text-lg! text-indigo-200!">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <div className="bg-gray-800! rounded-xl! shadow-lg! shadow-indigo-950/50! p-6!">
            <h2 className="text-xl! font-extrabold! text-indigo-300! mb-4! drop-shadow-lg!">
              Payment Information
            </h2>

            <div className="space-y-4!">
              <div>
                <label className="block! text-gray-300! mb-1!">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full! p-2! bg-gray-700! text-white! border! border-gray-600! rounded-lg! focus:outline-none! focus:ring-2! focus:ring-indigo-500!"
                  required
                />
              </div>

              <div className="grid! grid-cols-2! gap-4!">
                <div>
                  <label className="block! text-gray-300! mb-1!">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full! p-2! bg-gray-700! text-white! border! border-gray-600! rounded-lg! focus:outline-none! focus:ring-2! focus:ring-indigo-500!"
                    required
                  />
                </div>
                <div>
                  <label className="block! text-gray-300! mb-1!">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full! p-2! bg-gray-700! text-white! border! border-gray-600! rounded-lg! focus:outline-none! focus:ring-2! focus:ring-indigo-500!"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block! text-gray-300! mb-1!">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full! p-2! bg-gray-700! text-white! border! border-gray-600! rounded-lg! focus:outline-none! focus:ring-2! focus:ring-indigo-500!"
                  required
                />
              </div>

              <Button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="w-full! bg-indigo-700! hover:bg-indigo-600! text-white! py-3! rounded-lg! font-medium! mt-4! transition-all! duration-300! shadow-md! hover:shadow-lg! disabled:opacity-50! disabled:cursor-not-allowed!"
              >
                {paymentProcessing ? "Processing..." : "Complete Purchase"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full! bg-indigo-950! text-white! py-6!">
        <div className="container! mx-auto! px-4! text-center!">
          <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
          <div className="mt-2! space-x-4!">
            <a href="/terms" className="hover:text-indigo-300!">
              Terms
            </a>
            <a href="/privacy" className="hover:text-indigo-300!">
              Privacy
            </a>
            <a href="/contact" className="hover:text-indigo-300!">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
