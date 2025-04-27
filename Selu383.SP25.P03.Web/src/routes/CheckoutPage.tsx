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

interface CheckoutState {
  selectedSeats?: Seat[];
  showtime?: any;
  theater?: any;
  movie?: any;
  poster?: any;
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

  const handlePayment = async () => {
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
      const response = await axios.post("/api/ticket/create-tickets", {
        userId: userId,
        orderId: Date.now(),
        screeningId: showtime.id,
        seats: selectedSeats.map((seat) => ({
          seatId: seat.id,
          seatType: getSeatTypeName(seat.seatTypeId),
          price: getSeatPrice(seat.seatTypeId),
        })),
      });

      if (response.status === 200) {
        clearCart();
        setOrderComplete(true);

        try {
          await axios.post("/api/email/send", {
            recipientEmail: customerEmail,
            movieTitle: movie.title,
            showtime: formattedShowtime,
            seats: formattedSeats,
            total: calculateTotal(),
          });
        } catch (emailErr) {
          console.error("Failed to send email:", emailErr);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.seats) {
          setError(
            `Seats ${errorData.seats.join(", ")} are no longer available`
          );
          errorData.seats.forEach((seatId: number) => {
            removeFromCart(seatId);
          });
        } else {
          setError(errorData.message || "Seat conflict occurred");
        }
      } else {
        console.error("Payment error:", err);
        setError("Payment failed. Please try again.");
      }
    } finally {
      setPaymentProcessing(false);
    }
  };

  useEffect(() => {
    const initStripe = async () => {
      try {
        const publishableKey = await getStripePublishableKey();
        const stripe = await loadStripe(publishableKey);
        setStripeInstance(stripe);
      } catch (err) {
        console.error("Stripe init error", err);
        setError("Could not load Stripe.");
      }
    };

    initStripe();
  }, []);

  const handleStripePayment = async () => {
    if (!stripeInstance) {
      setError("Stripe not initialized.");
      return;
    }

    setPaymentProcessing(true);

    try {
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
      }
    } catch (err) {
      console.error(err);
      setError("Stripe payment failed. Try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

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
          </div>
        </footer>
      </div>
    );
  }

  if (orderComplete) {
    navigate("/checkout/success");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6 flex-1">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-400 mb-6 hover:text-indigo-300 transition-colors duration-300"
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

            {movie && (
              <>
                <h3 className="text-lg font-bold text-white mb-2">
                  {movie.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {theater?.name} • {formattedShowtime}
                </p>
              </>
            )}

            {selectedSeats.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-indigo-200 mb-2">Seats:</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="bg-indigo-900 text-indigo-100 px-3 py-1 rounded-full text-sm"
                    >
                      {seat.row}
                      {seat.seatNumber} ({getSeatTypeName(seat.seatTypeId)})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cart.some((item) => item.type === "concession") && (
              <div className="mb-6">
                <h3 className="font-bold text-indigo-200 mb-2">Concessions:</h3>
                <ul className="space-y-2">
                  {cart
                    .filter((item) => item.type === "concession")
                    .map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center"
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
                            className="bg-red-600 text-white w-6 h-6 rounded flex items-center justify-center"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => addToCart({ ...item, quantity: 1 })}
                            className="bg-green-600 text-white w-6 h-6 rounded flex items-center justify-center"
                          >
                            +
                          </button>
                          <span className="ml-2">{item.name}</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between font-bold text-lg text-indigo-200">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg shadow-indigo-950/50 p-6">
            <h2 className="text-xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
              Payment Information
            </h2>

            <div className="space-y-4">
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
                disabled={paymentProcessing || !stripeInstance}
                className="w-full bg-black text-white py-3 rounded-lg font-medium mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay with Apple Pay / Card
              </Button>

              <Button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium mt-4 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </footer>
    </div>
  );
}
