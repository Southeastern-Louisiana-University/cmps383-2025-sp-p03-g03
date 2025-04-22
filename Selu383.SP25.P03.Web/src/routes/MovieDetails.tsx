import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import { TicketIcon, PlayCircleIcon } from "@heroicons/react/24/outline";

interface Movie {
  id: number;
  title: string;
  ageRating: string;
  runtime: number;
  releaseDate: string;
  category: string;
  description: string;
  previewURL: string | null;
  isActive: boolean;
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
  rows?: number;
  columns?: number;
}

interface Room {
  id: number;
  name: string;
  theaterId: number;
  rows: number;
  columns: number;
}

interface MovieRoomScheduleLink {
  id: number;
  theaterId: number;
  roomId: number;
  movieId: number;
  movieScheduleId: number;
  room: Room | null;
}

function MovieDetails() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [poster, setPoster] = useState<MoviePoster[] | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [schedules, setSchedules] = useState<MovieSchedule[]>([]);
  const [roomScheduleLinks, setRoomScheduleLinks] = useState<
    MovieRoomScheduleLink[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShowtimes, setShowShowtimes] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const theaterId = localStorage.getItem("theaterId");

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!movieId || isNaN(parseInt(movieId))) {
          throw new Error("Invalid movie ID");
        }

        const [movieResponse, posterResponse, theatersResponse] =
          await Promise.all([
            fetch(`/api/movie/${movieId}`),
            fetch(`/api/MoviePoster/GetByMovieId/${movieId}`),
            fetch("/api/theaters"),
          ]);

        if (!movieResponse.ok)
          throw new Error(`Failed to fetch movie: ${movieResponse.status}`);
        if (!posterResponse.ok)
          throw new Error(`Failed to fetch poster: ${posterResponse.status}`);
        if (!theatersResponse.ok)
          throw new Error(
            `Failed to fetch theaters: ${theatersResponse.status}`
          );

        const checkJson = async (response: Response, endpoint: string) => {
          const contentType = response.headers.get("Content-Type");
          if (!contentType?.includes("application/json")) {
            const text = await response.text();
            console.error(
              `Non-JSON response from ${endpoint}:`,
              text.slice(0, 200)
            );
            throw new Error(
              `Expected JSON from ${endpoint}, got ${contentType}`
            );
          }
        };

        await checkJson(movieResponse, `/api/movie/${movieId}`);
        await checkJson(
          posterResponse,
          `/api/MoviePoster/GetByMovieId/${movieId}`
        );
        await checkJson(theatersResponse, "/api/theaters");

        const [movieData, posterData, theatersData] = await Promise.all([
          movieResponse.json(),
          posterResponse.json(),
          theatersResponse.json(),
        ]);

        setMovie(movieData);
        setPoster(posterData);
        setTheaters(theatersData);

        if (theaterId) {
          await fetchTheaterData(theaterId);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, theaterId]);

  const fetchTheaterData = async (selectedTheaterId: string) => {
    try {
      if (!movieId) {
        throw new Error("Movie ID is not defined");
      }

      const scheduleResponse = await fetch(
        `/api/MovieSchedule/GetByMovieId/${movieId}?theaterId=${selectedTheaterId}`
      );
      let scheduleData: MovieSchedule[] = [];
      let roomScheduleData: MovieRoomScheduleLink[] = [];
      let roomsData: Room[] = [];

      const checkJson = async (response: Response, endpoint: string) => {
        const contentType = response.headers.get("Content-Type");
        if (!contentType?.includes("application/json")) {
          const text = await response.text();
          console.error(
            `Non-JSON response from ${endpoint}:`,
            text.slice(0, 200)
          );
          throw new Error(`Expected JSON from ${endpoint}, got ${contentType}`);
        }
      };

      if (scheduleResponse.ok) {
        await checkJson(
          scheduleResponse,
          `/api/MovieSchedule/GetByMovieId/${movieId}`
        );
        scheduleData = await scheduleResponse.json();
        setSchedules(scheduleData);
      } else {
        console.warn(
          `No schedules for theater ${selectedTheaterId}: ${scheduleResponse.status}`
        );
      }

      if (scheduleData.length > 0) {
        const linkPromises = scheduleData.map((schedule) =>
          fetch(`/api/MovieRoomScheduleLink/GetByScheduleId/${schedule.id}`)
            .then(async (response) => {
              if (!response.ok) return [];
              await checkJson(
                response,
                `/api/MovieRoomScheduleLink/GetByScheduleId/${schedule.id}`
              );
              return response.json() as Promise<MovieRoomScheduleLink[]>;
            })
            .catch((err) => {
              console.error(
                `Error fetching links for schedule ${schedule.id}:`,
                err
              );
              return [];
            })
        );

        const linksArrays = await Promise.all(linkPromises);
        roomScheduleData = linksArrays.flat();

        const roomsResponse = await fetch(
          `/api/Room/GetByTheaterId/${selectedTheaterId}`
        );
        if (roomsResponse.ok) {
          await checkJson(
            roomsResponse,
            `/api/Room/GetByTheaterId/${selectedTheaterId}`
          );
          roomsData = await roomsResponse.json();
        } else {
          console.warn(
            `No rooms for theater ${selectedTheaterId}: ${roomsResponse.status}`
          );
          roomsData = [];
        }
      }

      const updatedLinks = roomScheduleData.map((link) => ({
        ...link,
        room: roomsData.find((r) => r.id === link.roomId) || null,
      }));
      setRoomScheduleLinks(updatedLinks);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Theater data error:", error);
    }
  };

  const handleShowtimesClick = () => {
    if (theaters.length === 0) {
      setError("No theaters available");
      return;
    }
    setShowShowtimes(!showShowtimes);
  };

  const handleTheaterSelect = async (selectedTheaterId: string) => {
    localStorage.setItem("theaterId", selectedTheaterId);
    setShowShowtimes(true);
    await fetchTheaterData(selectedTheaterId);
  };

  const handleSeatSelection = (
    event: React.MouseEvent<HTMLButtonElement>,
    showtime: MovieSchedule,
    time: string,
    room: Room | null
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const selectedTheater = theaters.find((t) => t.id.toString() === theaterId);
    if (!selectedTheater) {
      setError("Please select a theater");
      return;
    }
    if (!room || !room.id) {
      setError("No valid room assigned for this showtime");
      return;
    }
    if (!movieId || isNaN(parseInt(movieId))) {
      setError("Invalid movie selection");
      return;
    }
    if (!movie) {
      setError("Movie data not loaded");
      return;
    }

    navigate(
      `/movies/${movieId}/seats/${theaterId}/${room.id}/${showtime.id}`,
      {
        state: {
          time,
          movie,
          theater: selectedTheater,
          room,
        },
      }
    );
  };

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
          <button
            onClick={() => navigate("/movies")}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  if (!movie || !movie.isActive)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl text-gray-300">Movie not available</div>
      </div>
    );

  const activeShowtimes = schedules
    .filter((schedule) => schedule.isActive)
    .flatMap((schedule) =>
      schedule.movieTimes.map((time) => {
        const link = roomScheduleLinks.find(
          (link) => link.movieScheduleId === schedule.id
        );
        return {
          time,
          scheduleId: schedule.id,
          theaterId: schedule.theaterId,
          room: link?.room || null,
        };
      })
    );

  const selectedTheater = theaters.find((t) => t.id.toString() === theaterId);
  const videoId = movie.previewURL ? getYouTubeVideoId(movie.previewURL) : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto mt-16 flex-1">
        <div className="flex-shrink-0">
          {poster && poster.length > 0 && (
            <img
              src={`data:${poster[0].imageType};base64,${poster[0].imageData}`}
              alt={`${movie.title} poster`}
              className="w-80 h-auto rounded-lg shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70"
              loading="lazy"
            />
          )}
        </div>
        <div className="flex flex-col gap-4 flex-grow">
          <h1 className="text-4xl font-extrabold text-indigo-300 drop-shadow-lg">
            {movie.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-lg text-indigo-400">
            <span>{movie.ageRating}</span>
            <span>-</span>
            <span>{movie.runtime} min</span>
            <span>-</span>
            <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
            <span>-</span>
            <span>{movie.category}</span>
          </div>
          <p className="text-lg text-gray-200 mt-4">{movie.description}</p>
          {videoId ? (
            <>
              <Button
                onClick={() => setShowVideo(!showVideo)}
                className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-fit"
              >
                {showVideo ? "Hide Trailer" : "Watch Trailer"}
                <PlayCircleIcon className="h-5 w-5" />
              </Button>
              {showVideo && (
                <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
                  <div
                    className="relative w-full"
                    style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
                      title={`${movie.title} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-300 mt-4">No trailer available</p>
          )}
          <Button
            onClick={handleShowtimesClick}
            className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-fit"
          >
            {theaterId ? "Show Showtimes" : "Select Theater"}
            <TicketIcon className="h-5 w-5" />
          </Button>
          {showShowtimes && !theaterId && (
            <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-indigo-300 mb-4">
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
          {showShowtimes && theaterId && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-indigo-300">
                  Available Showtimes
                </h2>
                {selectedTheater && (
                  <div className="bg-indigo-800 px-4 py-2 rounded-full">
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
                      className="bg-gray-800 p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-indigo-800/70"
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
                      <p className="text-gray-300">
                        {showtime.room
                          ? showtime.room.name
                          : "Room not assigned"}
                      </p>
                      <Button
                        onClick={(e) =>
                          handleSeatSelection(
                            e,
                            schedules.find(
                              (s) => s.id === showtime.scheduleId
                            )!,
                            showtime.time,
                            showtime.room
                          )
                        }
                        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition-all duration-300 shadow-md hover:shadow-lg"
                        disabled={!showtime.room || !showtime.room.id}
                      >
                        Select Seats
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg shadow-lg">
                  <p className="text-xl text-indigo-200">
                    No available showtimes
                  </p>
                  <p className="text-gray-300 mt-2">
                    Please check back later or select another theater
                  </p>
                </div>
              )}
            </div>
          )}
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

export default MovieDetails;
