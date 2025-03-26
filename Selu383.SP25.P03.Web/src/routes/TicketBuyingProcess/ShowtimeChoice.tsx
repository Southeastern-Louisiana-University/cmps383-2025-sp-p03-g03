import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";

interface MovieSchedule {
  id: number;
  movieTimes: string[];
  isActive: boolean;
  movieId: number;
}

interface Movie {
  id: number;
  title: string;
}

function ShowtimeChoice() {
  // Get movieId from URL params
  const { id: movieId } = useParams<{ id: string }>();
  // Get theaterId from query params
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [schedules, setSchedules] = useState<MovieSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theaterId = searchParams.get("theaterId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate movieId exists
        if (!movieId) {
          throw new Error("Movie ID is missing from URL");
        }

        console.log(
          `Fetching data for movie: ${movieId}, theater: ${theaterId}`
        );

        // Fetch movie details
        const movieResponse = await fetch(`/api/movie/${movieId}`);
        if (!movieResponse.ok) throw new Error("Movie not found");
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Fetch schedules (with theater filter if provided)
        const url = theaterId
          ? `/api/MovieSchedule/GetByMovieId/${movieId}?theaterId=${theaterId}`
          : `/api/MovieSchedule/GetByMovieId/${movieId}`;

        const scheduleResponse = await fetch(url);
        if (!scheduleResponse.ok) throw new Error("Failed to fetch schedules");
        const scheduleData = await scheduleResponse.json();
        setSchedules(scheduleData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, theaterId]);

  if (!movieId) {
    return (
      <div className="text-center py-12 text-red-500">
        <h2 className="text-xl font-bold">Error</h2>
        <p>Movie ID is missing from URL parameters</p>
        <p className="text-sm text-gray-500 mt-2">
          Expected URL format: /movies/:id/showtimes
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl">Loading showtimes...</div>
        <div className="text-sm text-gray-500 mt-2">
          Movie ID: {movieId} | Theater ID: {theaterId || "None"}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl font-bold">Error</div>
        <p className="text-gray-700 mt-2">{error}</p>
        <div className="text-sm text-gray-500 mt-4">
          <p>Movie ID: {movieId}</p>
          <p>Theater ID: {theaterId || "Not provided"}</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center py-12">Movie not found</div>;
  }

  // Get all active showtimes
  const activeShowtimes = schedules
    .filter((schedule) => schedule.isActive)
    .flatMap((schedule) => schedule.movieTimes);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-800 mt-20! mb-6">
        Showtimes for {movie.title}
      </h1>
      {theaterId && (
        <p className="text-lg text-gray-600 mb-8">Theater ID: {theaterId}</p>
      )}

      {activeShowtimes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeShowtimes.map((time, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
            >
              <h3 className="text-lg font-medium text-indigo-700">
                {new Date(time).toLocaleString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
              <Button
                onClick={() =>
                  navigate(
                    `/checkout?movieId=${movieId}&theaterId=${theaterId}&showtime=${encodeURIComponent(
                      time
                    )}`
                  )
                }
                className="mt-3 w-full bg-indigo-600! hover:bg-indigo-700 text-white py-2 rounded transition-colors"
              >
                Select
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600">No available showtimes</p>
          <p className="text-gray-500 mt-2">
            {theaterId
              ? "No showtimes for this theater"
              : "No showtimes scheduled"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ShowtimeChoice;
