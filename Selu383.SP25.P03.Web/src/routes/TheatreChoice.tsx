import { useState, useEffect } from "react";
import { Button } from "@headlessui/react";

interface Theater {
  id: number;
  name: string;
  location: string;
}

function TheatreChoice() {
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

        const response = await fetch("/api/theaters");
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
    console.log(theaterId);
  };

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-xl text-indigo-300 animate-pulse">
            Loading theaters...
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-2xl text-red-500 font-bold">Error</div>
            <p className="text-gray-300 mt-2">{error}</p>
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex-1 py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-300 text-center mb-20! drop-shadow-lg">
          Choose Your Theater
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className="bg-gray-800! rounded-lg p-6 shadow-lg! shadow-indigo-950/50! transition-all duration-300 hover:shadow-indigo-800/70!"
            >
              <h2 className="text-xl font-semibold text-indigo-200">
                {theater.name}
              </h2>
              <p className="text-gray-300 mt-2">{theater.location}</p>

              {selectedTheater === theater.id ? (
                <Button className="mt-4 bg-indigo-900! text-indigo-300 py-2 px-4 rounded transition-colors cursor-default shadow-md">
                  Selected
                </Button>
              ) : (
                <Button
                  onClick={() => handleTheaterSelect(theater.id)}
                  className="mt-4 bg-indigo-700! hover:bg-indigo-600! text-white py-2 px-4 rounded transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Select Theater
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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

export default TheatreChoice;
