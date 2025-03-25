import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";

interface Theater {
  id: number;
  name: string;
  location: string;
}

function TheatreChoice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const movieId = searchParams.get("movieId");

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);

        // First validate movieId exists
        if (!movieId) {
          throw new Error("Movie ID is required");
        }

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
  }, [movieId]); // Add movieId to dependencies

  const handleTheaterSelect = (theaterId: number) => {
    if (!movieId) {
      setError("Cannot proceed - missing movie ID");
      return;
    }
    // Navigate to showtimes with both IDs
    navigate(`/movies/${movieId}/showtimes?theaterId=${theaterId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading theaters...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-xl font-bold">Error</div>
        <p className="text-gray-700 mt-2">{error}</p>
        {!movieId && (
          <p className="text-sm text-gray-500 mt-4">
            No movie ID provided in URL parameters
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-indigo-800 mt-20! mb-8">
        Select a Theater for Movie ID: {movieId}
      </h1>

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

            <Button
              onClick={() => handleTheaterSelect(theater.id)}
              className="mt-4 bg-indigo-600! hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
            >
              Select Theater
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TheatreChoice;
