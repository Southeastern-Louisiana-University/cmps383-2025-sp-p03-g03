import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  rows: number;
  columns: number;
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [poster, setPoster] = useState<MoviePoster[] | null>(null);
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

        const [movieResponse, posterResponse, theatersResponse] =
          await Promise.all([
            fetch(`/api/movie/${id}`),
              fetch(`/api/MoviePoster/GetByMovieId/${id}`),
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
      setShowShowtimes(true);
    } else {
      setShowShowtimes(!showShowtimes);
    }
  };

  const handleTheaterSelect = (selectedTheaterId: string) => {
    localStorage.setItem("theaterId", selectedTheaterId);
    setShowShowtimes(true);
    fetch(
      `/api/MovieSchedule/GetByMovieId/${id}?theaterId=${selectedTheaterId}`
    )
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setSchedules(data));
  };

  const handleSeatSelection = (showtime: MovieSchedule, time: string) => {
    const selectedTheater = theaters.find((t) => t.id.toString() === theaterId);
    if (!selectedTheater) return;

    navigate(`/movies/${movieId}/seats`, {
      state: {
        showtime: {
          id: showtime.id,
          time: time,
          movieId: movieId,
        },
        theater: selectedTheater,
        movie: movie,
      },
    });
  };

  const currentYear = new Date().getFullYear();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl text-indigo-300 animate-pulse">
          Loading movie details...
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl text-red-500 font-bold">Error</div>
          <p className="text-gray-300 mt-2">{error}</p>
        </div>
      </div>
    );
  if (!movie)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl text-gray-300">Movie not found</div>
      </div>
    );

  const activeShowtimes = schedules
    .filter((schedule) => schedule.isActive)
    .flatMap((schedule) =>
      schedule.movieTimes.map((time) => ({
        time,
        scheduleId: schedule.id,
        theaterId: schedule.theaterId,
      }))
    );

  const selectedTheater = theaters.find((t) => t.id.toString() === theaterId);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto mt-16 flex-1">
        {/* Poster */}
        <div className="flex-shrink-0">
          {poster && (
            <img
              src={`data:${poster[0].imageType};base64,${poster[0].imageData}`}
              alt={`${movie.title} poster`}
              className="w-80 h-auto rounded-lg shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70"
              loading="lazy"
            />
          )}
        </div>

        {/* Movie Info */}
        <div className="flex flex-col gap-4 flex-grow">
          <h1 className="text-4xl font-extrabold text-indigo-300 drop-shadow-lg">
            {movie.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-lg text-indigo-400">
            <span>{movie.ageRating}</span>
            <p>-</p>
            <span>{movie.runtime} min</span>
            <p>-</p>
            <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
            <p>-</p>
            <span>{movie.category}</span>
          </div>

          <p className="text-lg text-gray-200 mt-4">{movie.description}</p>

          <Button
            onClick={handleShowtimesClick}
            className="mt-6 flex items-center gap-2 bg-indigo-700! hover:bg-indigo-600! text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-fit"
          >
            {theaterId ? "Show Showtimes" : "Select Theater"}{" "}
            <TicketIcon className="h-5 w-5" />
          </Button>

          {/* Theater Selection */}
          {showShowtimes && !theaterId && (
            <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-2xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
                Select Theater
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {theaters.map((theater) => (
                  <div
                    key={theater.id}
                    className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
                    onClick={() => handleTheaterSelect(theater.id.toString())}
                  >
                    <h3 className="text-lg font-medium text-indigo-200">
                      {theater.name}
                    </h3>
                    <p className="text-gray-300">{theater.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Showtimes Section */}
          {showShowtimes && theaterId && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-extrabold text-indigo-300 drop-shadow-lg">
                  Available Showtimes
                </h2>
                {selectedTheater && (
                  <div className="bg-indigo-900 px-4 py-2 rounded-full">
                    <span className="font-medium text-indigo-200">
                      {selectedTheater.name}
                    </span>
                    <span className="text-indigo-400 ml-2">
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
                      className="bg-gray-800 p-4 rounded-lg shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70"
                    >
                      <h3 className="text-lg font-medium text-indigo-200">
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
                          handleSeatSelection(
                            schedules.find(
                              (s) => s.id === showtime.scheduleId
                            )!,
                            showtime.time
                          )
                        }
                        className="mt-3 w-full bg-indigo-700! hover:bg-indigo-600! text-white py-2 rounded transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Select Seats
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg shadow-lg shadow-indigo-950/50">
                  <p className="text-xl text-indigo-200">
                    No available showtimes
                  </p>
                  <p className="text-gray-300 mt-2">
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

export default MovieDetails;
