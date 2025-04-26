import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  description: string;
  ageRating: string;
  runtime: number;
  poster: MoviePoster[] | null;
  isActive: boolean;
}

interface MoviePoster {
  imageType: string;
  imageData: string;
  name: string;
}

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`/api/movie/Active`);
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data: Omit<Movie, "poster">[] = await response.json();
        console.log(data);

        const moviesWithPosters: Movie[] = await Promise.all(
          data.map(async (movie) => {
            try {
              const posterResponse = await fetch(
                `/api/MoviePoster/GetByMovieId/${movie.id}`
              );
              if (!posterResponse.ok) {
                throw new Error(`Failed to fetch poster for movie ${movie.id}`);
              }
              const posterData: MoviePoster[] = await posterResponse.json();
              return { ...movie, poster: posterData };
            } catch (error) {
              console.error(error);
              return { ...movie, poster: null };
            }
          })
        );

        // Filter active movies
        setMovies(moviesWithPosters.filter((movie) => movie.isActive));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl animate-pulse">Loading Movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl text-red-500 font-bold">Error</div>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="w-full py-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-300 tracking-wide drop-shadow-lg">
          NOW PLAYING
        </h1>
      </div>

      {/* Grid for Movies */}
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto">
        {movies.map((movie) => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105"
          >
            {/* Poster Container */}
            <div className="relative w-full max-w-[250px] rounded-lg overflow-hidden outline-3 outline-indigo-300 shadow-lg shadow-indigo-950/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-800/70">
              {movie.poster ? (
                <>
                  <img
                    src={`data:${movie.poster[0].imageType};base64,${movie.poster[0].imageData}`}
                    alt={`${movie.title} poster`}
                    className="w-full h-auto aspect-[2/3] object-cover transition-all duration-300 group-hover:blur-sm"
                    loading="lazy"
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "path/to/fallback-image.jpg";
                    }}
                  />
                  <div className="absolute inset-0 flex-col items-start justify-center bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-indigo-300 font-bold text-sm md:text-base px-4 mt-2 mb-10 text-center line-clamp-6">
                      Rated {movie.ageRating} - {movie.runtime} Mins
                    </p>
                    <p className="text-indigo-300 text-sm md:text-base px-4 text-center line-clamp-6">
                      {movie.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full h-[375px] bg-gray-800 flex items-center justify-center rounded-lg border border-indigo-700">
                  <span className="text-indigo-300 font-medium">
                    No Poster Available
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-indigo-200 text-center transition-colors duration-300 group-hover:text-indigo-100">
              {movie.title}
            </h2>
          </Link>
        ))}
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

export default Movies;
