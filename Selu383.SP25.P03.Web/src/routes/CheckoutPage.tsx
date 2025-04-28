import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useAuth } from "../components/authContext";
import axios from "axios";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { getStripePublishableKey } from "../Services/PaymentService";
import { CartItemType, SeatCartItem, useCart } from "../components/CartContext";
import { getSeatPrice, getSeatTypeName } from "../Utils/seats";
import { SeatTakenService } from "../Services/SeatTakenService";

interface Seat {
  id: number;
  seatTypeId: number;
  roomsId: number;
  isAvailable: boolean;
  row: string;
  seatNumber: number;
  xPosition?: number;
  yPosition?: number;
}

interface CheckoutState {
  selectedSeats?: Seat[];
  showtime?: any;
  theater?: any;
  movie?: any;
  poster?: string;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { cart, clearCart, removeFromCart, addToCart } = useCart();
  const locationState = location.state as CheckoutState | null;

  const selectedSeats =
    locationState?.selectedSeats ||
    cart
      .filter((item) => item.type === "seat")
      .map((item) => ({
        id: item.id,
        row: (item as SeatCartItem).row,
        seatNumber: (item as SeatCartItem).seatNumber,
        seatTypeId: (item as SeatCartItem).seatTypeId,
        roomsId: parseInt(location.pathname.split("/")[4] || "0", 10),
      }));

  const showtime =
    locationState?.showtime ||
    (cart.find((item) => item.type === "seat") as SeatCartItem)?.showtime ||
    null;

  const movie =
    locationState?.movie ||
    (cart.find((item) => item.type === "seat") as SeatCartItem)?.movie ||
    null;
  const theater =
    locationState?.theater ||
    (cart.find((item) => item.type === "seat") as SeatCartItem)?.theater ||
    null;

  const [error, setError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [showConcessionPrompt, setShowConcessionPrompt] = useState(false);
  const [pendingPaymentType, setPendingPaymentType] = useState<
    "stripe" | "regular" | null
  >(null);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  const formattedSeats = selectedSeats
    .map((seat) => `${seat.row}${seat.seatNumber}`)
    .join(", ");

  const formattedShowtime = showtime
    ? new Date(showtime.time).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  useEffect(() => {
    if (!userId) {
      setError("You must be logged in to complete a purchase.");
    } else if (!showtime || !theater || !selectedSeats?.length || !movie) {
      setError("Please select a movie, theater, showtime, and seats first.");
    }
  }, [userId, showtime, theater, selectedSeats, movie]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const markSeatsAsTaken = async () => {
    if (!theater?.id || !showtime?.id) {
      console.error("Missing theater ID or showtime ID");
      return false;
    }

    try {
      const roomId =
        selectedSeats[0]?.roomsId ||
        parseInt(location.state?.selectedSeats?.[0]?.roomsId || "0", 10);

      if (!roomId) {
        console.error("Could not determine room ID");
        return false;
      }

      const takenSeatsPromises = selectedSeats.map((seat) =>
        SeatTakenService.create({
          theaterId: theater.id,
          movieScheduleId: showtime.id,
          roomsId: roomId,
          seatId: seat.id,
          isTaken: true,
        })
      );

      await Promise.all(takenSeatsPromises);
      console.log(`Successfully marked ${selectedSeats.length} seats as taken`);
      return true;
    } catch (error) {
      console.error("Failed to mark seats as taken:", error);
      return false;
    }
  };

  const continueRegularPayment = async () => {
    if (!userId) {
      setError("Please log in to complete your purchase.");
      return;
    }

    if (!showtime?.id) {
      setError("Invalid showtime selected.");
      return;
    }

    setPaymentProcessing(true);
    try {
      const seatsMarked = await markSeatsAsTaken();
      if (!seatsMarked) {
        throw new Error("Failed to mark seats as taken");
      }

      await axios.post("/api/ticket/create-tickets", {
        userId: userId,
        orderId: Date.now(),
        screeningId: showtime.id,
        seats: selectedSeats.map((seat) => ({
          seatId: seat.id,
          seatType: getSeatTypeName(seat.seatTypeId),
          price: getSeatPrice(seat.seatTypeId),
        })),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      clearCart();
      setOrderComplete(true);
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);

      try {
        await axios.post("/api/email/send", {
          recipientEmail: customerEmail,
          movieTitle: movie.title,
          showtime: formattedShowtime,
          seats: formattedSeats,
        });
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr);
      }
    }
  };

  const continueStripePayment = async () => {
    if (!stripeInstance) {
      setError("Stripe not initialized.");
      return;
    }

    setPaymentProcessing(true);

    try {
      const seatsMarked = await markSeatsAsTaken();
      if (!seatsMarked) {
        throw new Error("Failed to mark seats as taken");
      }

      const response = await axios.post("/api/stripe/create-session", {
        amount: calculateTotal(),
        description: `Movie: ${movie.title}, Seats: ${formattedSeats}`,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout`,
        customerEmail: customerEmail,
        metadata: {
          movieTitle: movie.title,
          showtime: formattedShowtime,
          seats: formattedSeats,
          theaterName: theater.name,
          total: calculateTotal(),
          userId: userId,
        },
      });

      const sessionId = response.data.sessionId;
      const result = await stripeInstance.redirectToCheckout({ sessionId });

      if (result?.error) {
        setError(result.error.message || "Stripe checkout failed.");
        setPaymentProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setError("Stripe payment failed. Try again.");
      setPaymentProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (
      cart.some((item) => item.type === "seat") &&
      cart.every((item) => item.type !== "concession")
    ) {
      setPendingPaymentType("regular");
      setShowConcessionPrompt(true);
      return;
    }
    await continueRegularPayment();
  };

  const handleStripePayment = async () => {
    if (
      cart.some((item) => item.type === "seat") &&
      cart.every((item) => item.type !== "concession")
    ) {
      setPendingPaymentType("stripe");
      setShowConcessionPrompt(true);
      return;
    }
    await continueStripePayment();
  };

  useEffect(() => {
    const initStripe = async () => {
      try {
        const publishableKey = await getStripePublishableKey();
        const stripe = await loadStripe(publishableKey);
        if (!stripe) {
          setError("Failed to initialize Stripe.");
          return;
        }
        setStripeInstance(stripe);
      } catch (err) {
        console.error("Stripe init error", err);
        setError("Could not load Stripe.");
      }
    };

    initStripe();
  }, []);

  const currentYear = new Date().getFullYear();

  if (!userId) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6 text-center text-red-500 flex-1 flex items-center justify-center">
          <div>
            <p>{error || "Invalid checkout data"}</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4 bg-indigo-700 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Return to Home
            </Button>
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

  if (orderComplete) {
    navigate("/checkout/success");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Concession Prompt Modal */}
      {showConcessionPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg shadow-indigo-950/50">
            <h3 className="text-xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
              Add Concessions?
            </h3>
            <p className="text-gray-300 mb-6">
              Your cart has no concessions. Would you like to add some to your
              order?
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowConcessionPrompt(false);
                  navigate("/concessions", {
                    state: { selectedSeats, showtime, theater, movie },
                  });
                }}
                className="flex-1 bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Yes, add concessions
              </Button>
              <Button
                onClick={async () => {
                  setShowConcessionPrompt(false);
                  setPendingPaymentType(null);
                  if (pendingPaymentType === "stripe") {
                    await continueStripePayment();
                  } else if (pendingPaymentType === "regular") {
                    await continueRegularPayment();
                  }
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                No, continue
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 flex-1">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-400 mb-6 hover:text-indigo-300 transition-colors duration-300 cursor-pointer"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Seat Selection
        </Button>

        <h1 className="text-3xl font-extrabold text-indigo-300 mb-6 drop-shadow-lg">
          Checkout
        </h1>
        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-gray-800 rounded-xl shadow-lg shadow-indigo-950/50 p-6">
            <h2 className="text-xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
              Order Summary
            </h2>
            {movie ? (
              <>
                <h2 className="text-xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
                  Movie:
                </h2>
                <h3 className="text-lg font-extrabold text-white drop-shadow-lg">
                  {movie.title} @ {formattedShowtime}
                </h3>
              </>
            ) : (
              <h2 className="text-xl font-extrabold text-red-400 mb-4 drop-shadow-lg">
                No movie selected
              </h2>
            )}
            <div className="flex gap-4 mb-6"></div>
            {cart.filter((item) => item.type === "seat").length > 0 && (
              <div>
                <h2 className="border-t border-gray-700 pt-4 mt-4 flex justify-between font-bold text-lg text-indigo-200">
                  Seats
                </h2>
                <ul>
                  {cart
                    .filter((item) => item.type === "seat")
                    .map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {cart.some((item) => item.type === "concession") && (
              <>
                <h2 className="border-t border-gray-700 pt-4 mt-4 flex justify-between font-bold text-lg text-indigo-200">
                  Concessions
                </h2>
                <ul>
                  {cart
                    .filter((item) => item.type === "concession")
                    .map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center py-2"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                addToCart({ ...item, quantity: -1 });
                              } else {
                                removeFromCart(item.id);
                              }
                            }}
                            className="bg-red-600 text-white px-2 rounded"
                          >
                            -
                          </button>
                          <span className="text-white">{item.quantity}</span>
                          <button
                            onClick={() => addToCart({ ...item, quantity: 1 })}
                            className="bg-green-600 text-white px-2 rounded"
                          >
                            +
                          </button>
                          <span className="ml-4">{item.name}</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                </ul>
              </>
            )}
            <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between font-bold text-lg text-indigo-200">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <Button
              onClick={() => {
                clearCart();
                navigate("/");
              }}
              className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium mt-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Clear Cart
            </Button>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg shadow-indigo-950/50 p-6">
            <h2 className="text-xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
              Payment Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Name on Card</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <Button
                onClick={handleStripePayment}
                className="w-full bg-black text-white py-3 rounded-lg font-medium mt-4 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Pay with Apple Pay / Card
              </Button>
              <Button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium mt-4 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentProcessing ? "Processing..." : "Complete Purchase"}
              </Button>
            </div>
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
