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
    <div>
      <h1>{movie.title}</h1>
      <p>
        <strong>Description:</strong> {movie.description}
      </p>
      <p>
        <strong>Category:</strong> {movie.category}
      </p>
      <p>
        <strong>Runtime:</strong> {movie.runtime} minutes
      </p>
      <p>
        <strong>Age Rating:</strong> {movie.ageRating}
      </p>
      <p>
        <strong>Release Date:</strong>{" "}
        {new Date(movie.releaseDate).toLocaleDateString()}
      </p>
    </div>
  );
}

export default MovieDetails;
