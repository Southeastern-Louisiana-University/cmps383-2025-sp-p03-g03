import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`https://localhost:7027/api/movie/${id}`);
        if (!response.ok) {
          throw new Error("Movie not found");
        }
        const data = await response.json();
        setMovie(data);

        // Fetch the movie poster
        const posterResponse = await fetch(
          `https://localhost:7027/api/movieposter/${id}`
        );
        if (!posterResponse.ok) {
          throw new Error("Poster not found");
        }
        const posterData = await posterResponse.json();
        setPoster(posterData);
      } catch (error) {
        setError(error.message);
        setMovie(null);
        setPoster(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-row gap-4 p-8 text-indigo-700 justify-center items-start mt-24">
      {/* Poster Container */}
      <div className="flex justify-center items-center">
        {poster && (
          <img
            src={`data:${poster.imageType};base64,${poster.imageData}`}
            alt={poster.name}
            className="w-96 h-auto object-cover rounded-2xl"
          />
        )}
      </div>

      {/* Text Container */}
      <div className="flex flex-col gap-2 items-start">
        <h1 className="text-5xl">
          <strong>{movie.title}</strong>
        </h1>
        <p className="text-xl">
          {movie.ageRating} - {movie.runtime} minutes -{" "}
          {new Date(movie.releaseDate).toLocaleDateString()} - {movie.category}
        </p>
        <p className="text-md mt-4">{movie.description}</p>
      </div>
    </div>
  );
}

export default MovieDetails;
