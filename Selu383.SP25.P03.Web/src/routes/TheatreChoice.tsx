import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import { ArrowLeftIcon, TicketIcon } from "@heroicons/react/24/outline";

interface Theater {
  id: number;
  name: string;
  location: string;
}

function TheatreChoice() {
  const navigate = useNavigate();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedTheaterId = localStorage.getItem("theaterId");
    if (savedTheaterId) {
      try {
        setSelectedTheater(JSON.parse(savedTheaterId));
      } catch (e) {
        console.error("Failed to parse saved theater ID", e);
      }
    }

    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/theaters/active");
        if (!response.ok) throw new Error("Failed to load theaters");
        const data = await response.json();
        setTheaters(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  const handleTheaterSelect = (theaterId: number) => {
    setSelectedTheater(theaterId);
    localStorage.setItem("theaterId", JSON.stringify(theaterId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300! mb-4"></div>
        <p className="text-indigo-300">Loading theaters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-500 text-2xl font-bold">Error</p>
          <p className="text-gray-300 mt-2">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-700! hover:bg-indigo-600! text-white py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6 flex-1">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-400! mb-6 hover:text-indigo-300! transition-colors duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-300 mb-2 drop-shadow-lg">
            Select Your Theater
          </h1>
          <p className="text-lg text-gray-300">
            Choose from our premium locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className={`border rounded-lg p-6 transition-all duration-300 ${
                selectedTheater === theater.id
                  ? "outline-3! outline-indigo-300! bg-indigo-950/50 shadow-lg shadow-indigo-950/50"
                  : "border-gray-700 bg-gray-800 hover:shadow-md hover:shadow-indigo-950/30"
              }`}
            >
              <h2 className="text-xl font-semibold text-indigo-300">
                {theater.name}
              </h2>
              <p className="text-gray-300 mt-2">{theater.location}</p>

              {selectedTheater === theater.id ? (
                <Button
                  className="mt-4 w-full bg-indigo-700! text-white! py-2 px-4 rounded-lg! transition-colors! duration-300 flex items-center justify-center gap-2"
                  disabled
                >
                  <TicketIcon className="h-5 w-5" />
                  Selected
                </Button>
              ) : (
                <Button
                  onClick={() => handleTheaterSelect(theater.id)}
                  className="mt-4 w-full bg-indigo-700! hover:bg-indigo-600! text-white! py-2 px-4 rounded-lg! transition-colors! duration-300 flex items-center justify-center gap-2"
                >
                  <TicketIcon className="h-5 w-5" />
                  Select Theater
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="w-full bg-indigo-950 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} Lion's Den Cinemas. All rights
            reserved.
          </p>
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

export default TheatreChoice;
