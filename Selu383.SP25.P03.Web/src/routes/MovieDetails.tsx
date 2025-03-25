import React, { useState, useEffect } from "react";
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

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [poster, setPoster] = useState<MoviePoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const [movieResponse, posterResponse] = await Promise.all([
          fetch(`/api/movie/${id}`),
          fetch(`/api/movieposter/${id}`),
        ]);

        if (!movieResponse.ok) throw new Error("Movie not found");
        if (!posterResponse.ok) throw new Error("Poster not found");

        const [movieData, posterData] = await Promise.all([
          movieResponse.json(),
          posterResponse.json(),
        ]);

        setMovie(movieData);
        setPoster(posterData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading)
    return <div className="text-center py-8">Loading movie details...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  if (!movie) return <div className="text-center py-8">Movie not found</div>;

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
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-indigo-800">{movie.title}</h1>

        <div className="flex gap-4 text-lg text-indigo-700">
          <span>{movie.ageRating}</span>
          <span>{movie.runtime} min</span>
          <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
          <span>{movie.category}</span>
        </div>

        <p className="text-lg text-gray-700 mt-4">{movie.description}</p>

        <Button
          onClick={() => navigate(`/movies/${id}/theaters?movieId=${id}`)}
          className="mt-6 flex items-center gap-2 bg-indigo-600! hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors w-fit"
        >
          Buy Tickets <TicketIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default MovieDetails;
