import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link

function Movies() {
  const [movies, setMovies] = useState([]); // State to store the list of movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch the list of movies
        const response = await fetch(`https://localhost:7027/api/movie`);
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        console.log(data); // Log the API response

        // Fetch the poster for each movie
        const moviesWithPosters = await Promise.all(
          data.map(async (movie) => {
            try {
              const posterResponse = await fetch(
                `https://localhost:7027/api/movieposter/${movie.id}`
              );
              if (!posterResponse.ok) {
                throw new Error(`Failed to fetch poster for movie ${movie.id}`);
              }
              const posterData = await posterResponse.json();
              return { ...movie, poster: posterData }; // Add poster data to the movie object
            } catch (error) {
              console.error(error);
              return { ...movie, poster: null }; // If poster fetch fails, set poster to null
            }
          })
        );

        setMovies(moviesWithPosters);
      } catch (error) {
        setError(error.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 text-gray-900 w-full">
      <div className="flex-grow w-full">
        <div className="flex justify-center items-center w-full">
          <h1 className="text-9xl! font-bold text-indigo-700 mt-20 mb-16!">
            NOW PLAYING
          </h1>
        </div>

        {/* Grid for Movies */}
        <div className="grid grid-cols-3 gap-15 m-20">
          {movies.map((movie) => (
            <Link
              to={`/movies/${movie.id}`} // Link to the movie details page
              key={movie.id}
              className="flex flex-col items-center gap-4 transition-transform hover:scale-110 hover:underline! underline-offset-10! text-indigo-700! cursor-pointer"
            >
              {/* Poster Container */}
              <div className="flex justify-center items-center">
                {movie.poster ? (
                  <img
                    src={`data:${movie.poster.imageType};base64,${movie.poster.imageData}`}
                    alt={movie.poster.name}
                    className="w-96 h-auto object-cover rounded-2xl"
                    onError={(e) => {
                      e.target.src = "path/to/fallback-image.jpg"; // Fallback image
                    }}
                  />
                ) : (
                  <div className="w-96 h-64 bg-gray-300 flex items-center justify-center rounded-2xl">
                    <span className="text-gray-600">No Poster Available</span>
                  </div>
                )}
              </div>
              <h2 className="text-4xl font-bold text-indigo-700 text-center ">
                {movie.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="flex flex-row items-center justify-center min-w-screen bg-indigo-600 text-white h-full mt-16">
          <p className="text-xl font-bold mt-8 mb-8">
            @ 2025 Lion's Den Cinema
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Movies;
