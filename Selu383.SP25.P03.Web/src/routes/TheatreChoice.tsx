import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";

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

  if (loading) {
    return <div className="text-center py-8">Loading theaters...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-xl font-bold">Error</div>
        <p className="text-gray-700 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {theaters.map((theater) => (
        <div
          key={theater.id}
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-indigo-700">
            {theater.name}
          </h2>
          <p className="text-gray-600 mt-2">{theater.location}</p>

          {selectedTheater === theater.id ? (
            <Button className="mt-4 bg-gray-400! text-white py-2 px-4 rounded transition-colors cursor-default">
              Selected
            </Button>
          ) : (
            <Button
              onClick={() => handleTheaterSelect(theater.id)}
              className="mt-4 bg-indigo-600! hover:bg-indigo-700! text-white py-2 px-4 rounded transition-colors"
            >
              Select Theater
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default TheatreChoice;
