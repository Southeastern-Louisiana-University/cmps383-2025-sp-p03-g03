import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import { TicketIcon } from "@heroicons/react/24/outline";

interface Movie {
  id: number;
  title: string;
  ageRating: string;
  runtime: number;
  releaseDate: string;
  category: string;
  description: string;
}

interface MoviePoster {
  imageType: string;
  imageData: string;
  name: string;
}

interface MovieSchedule {
  id: number;
  movieTimes: string[];
  isActive: boolean;
  movieId: number;
  theaterId: number;
}

interface Theater {
  id: number;
  name: string;
  location: string;
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [poster, setPoster] = useState<MoviePoster | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [schedules, setSchedules] = useState<MovieSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShowtimes, setShowShowtimes] = useState(false);

  const theaterId = localStorage.getItem("theaterId");
  const movieId = id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all necessary data in parallel
        const [movieResponse, posterResponse, theatersResponse] =
          await Promise.all([
            fetch(`/api/movie/${id}`),
            fetch(`/api/movieposter/${id}`),
            fetch("/api/theaters"),
          ]);

        if (!movieResponse.ok) throw new Error("Movie not found");
        if (!posterResponse.ok) throw new Error("Poster not found");

        const [movieData, posterData, theatersData] = await Promise.all([
          movieResponse.json(),
          posterResponse.json(),
          theatersResponse.ok ? theatersResponse.json() : [],
        ]);

        setMovie(movieData);
        setPoster(posterData);
        setTheaters(theatersData);

        // Fetch schedules if theaterId is provided
        if (theaterId) {
          const scheduleResponse = await fetch(
            `/api/MovieSchedule/GetByMovieId/${id}?theaterId=${theaterId}`
          );
          if (scheduleResponse.ok) {
            const scheduleData = await scheduleResponse.json();
            setSchedules(scheduleData);
          }
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, theaterId]);

  const handleShowtimesClick = () => {
    if (theaters.length === 0) {
      setError("No theaters available");
      return;
    }

    if (!theaterId) {
      // If no theater selected, show theater selection
      setShowShowtimes(true);
    } else {
      // Toggle showtimes visibility
      setShowShowtimes(!showShowtimes);
    }
  };

  const handleTheaterSelect = (selectedTheaterId: string) => {
    navigate(`?theaterId=${selectedTheaterId}`);
    setShowShowtimes(true);
  };

  if (loading)
    return <div className="text-center py-8">Loading movie details...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  if (!movie) return <div className="text-center py-8">Movie not found</div>;

  // Get all active showtimes
  const activeShowtimes = schedules
    .filter((schedule) => schedule.isActive)
    .flatMap((schedule) =>
      schedule.movieTimes.map((time) => ({
        time,
        theaterId: schedule.theaterId,
      }))
    );

  // Find selected theater
  const selectedTheater = theaters.find((t) => t.id.toString() === theaterId);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto mt-16">
      {/* Poster */}
      <div className="flex-shrink-0">
        {poster && (
          <img
            src={`data:${poster.imageType};base64,${poster.imageData}`}
            alt={poster.name}
            className="w-80 h-auto rounded-lg shadow-lg"
          />
        )}
      </div>

      {/* Movie Info */}
      <div className="flex flex-col gap-4 flex-grow">
        <h1 className="text-4xl font-bold text-indigo-800">{movie.title}</h1>

        <div className="flex gap-4 text-lg text-indigo-700">
          <span>{movie.ageRating}</span>
          <span>{movie.runtime} min</span>
          <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
          <span>{movie.category}</span>
        </div>

        <p className="text-lg text-gray-700 mt-4">{movie.description}</p>

        <Button
          onClick={handleShowtimesClick}
          className="mt-6 flex items-center gap-2 bg-indigo-600! hover:bg-indigo-700! text-white py-3 px-6 rounded-lg transition-colors w-fit"
        >
          {theaterId ? "Show Showtimes" : "Select Theater"}{" "}
          <TicketIcon className="h-5 w-5" />
        </Button>

        {/* Theater Selection */}
        {showShowtimes && !theaterId && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">
              Select Theater
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {theaters.map((theater) => (
                <div
                  key={theater.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTheaterSelect(theater.id.toString())}
                >
                  <h3 className="text-lg font-medium">{theater.name}</h3>
                  <p className="text-gray-600">{theater.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Showtimes Section */}
        {showShowtimes && theaterId && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-800">
                Available Showtimes
              </h2>
              {selectedTheater && (
                <div className="bg-indigo-100 px-4 py-2 rounded-full">
                  <span className="font-medium">{selectedTheater.name}</span>
                  <span className="text-indigo-600 ml-2">
                    {selectedTheater.location}
                  </span>
                </div>
              )}
            </div>

            {activeShowtimes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeShowtimes.map((showtime, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
                  >
                    <h3 className="text-lg font-medium text-indigo-700">
                      {new Date(showtime.time).toLocaleString([], {
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
                          `/checkout?movieId=${movieId}&theaterId=${
                            showtime.theaterId
                          }&showtime=${encodeURIComponent(showtime.time)}`
                        )
                      }
                      className="mt-3 w-full bg-indigo-600! hover:bg-indigo-700! text-white py-2 rounded transition-colors"
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-xl text-gray-600">No available showtimes</p>
                <p className="text-gray-500 mt-2">
                  {theaterId
                    ? "No showtimes scheduled for this theater"
                    : "Please select a theater"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
