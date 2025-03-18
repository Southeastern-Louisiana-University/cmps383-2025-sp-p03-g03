import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
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
      } catch (error) {
        setError(error.message);
        setMovie(null);
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
    <div className="flex flex-row gap-4 p-8">
      <div className="flex flex-col gap-2 p-8 sm:flex-row sm:items-left justify-left sm:gap-6 sm:py-4 mt-16">
        <h1 className="text-5xl!">
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
