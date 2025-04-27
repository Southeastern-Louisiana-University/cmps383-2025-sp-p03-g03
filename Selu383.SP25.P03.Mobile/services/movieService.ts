// services/movieService.ts
import axios from "axios";

const BASE_URL = "https://cmps383-2025-sp25-p03-g03.azurewebsites.net";

export interface Movie {
  id: number;
  title: string;
  description: string;
  category: string;
  runtime: number;
  ageRating: string;
  releaseDate: string;
  poster: MoviePoster[] | null;
}

export interface MoviePoster {
  id: number;
  movieId: number;
  imageType: string;
  imageData: string;
  name: string;
}

export interface Theater {
  id: number;
  name: string;
}

export const getMovies = async (): Promise<Movie[]> => {
  const res = await axios.get(`${BASE_URL}/api/movie`);
  const movies = res.data;

  // ✅ Concurrently fetch posters for each movie
  const moviesWithPosters = await Promise.all(
    movies.map(async (movie: Omit<Movie, "poster">) => {
      try {
        const posterRes = await axios.get(`${BASE_URL}/api/MoviePoster/GetByMovieId/${movie.id}`);
        return { ...movie, poster: posterRes.data };
      } catch (error) {
        console.error(`❌ Failed to fetch poster for movie ${movie.id}`, error);
        return { ...movie, poster: null }; // Fallback: null posters if the call fails
      }
    })
  );

  return moviesWithPosters;
};

export const getMovieById = async (id: number | string): Promise<Movie> => {
  const res = await axios.get(`${BASE_URL}/api/movie/${id}`);
  const movie = res.data;

  try {
    const posterRes = await axios.get(`${BASE_URL}/api/MoviePoster/GetByMovieId/${movie.id}`);
    return { ...movie, poster: posterRes.data };
  } catch (error) {
    console.error(`❌ Failed to fetch poster for movie ${movie.id}`, error);
    return { ...movie, poster: null };
  }
};

export const getMovieScheduleDetails = async (movieId: number) => {
  const res = await fetch(`${BASE_URL}/api/MovieSchedule/GetByMovieId/${movieId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch movie schedule");
  }
  return res.json();
};

export const getTheaters = async (): Promise<Theater[]> => {
  const res = await axios.get(`${BASE_URL}/api/theaters`);
  return res.data;
};
