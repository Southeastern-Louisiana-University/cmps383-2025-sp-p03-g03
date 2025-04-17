// src/services/movieService.ts
import axios from "axios";

// Azure backend base URL
const BASE_URL = "https://cmps383-2025-sp25-p03-g03.azurewebsites.net";

// Interfaces
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
  imageType: string;
  imageData: string;
  name: string;
}

export interface Theater {
  id: number;
  name: string;
  // Add more fields if needed like location, address, etc.
}

// Fetch all movies and their posters
export const getMovies = async (): Promise<Movie[]> => {
  const res = await axios.get(`${BASE_URL}/api/movie`);
  const movies = res.data;

  // For each movie, fetch its poster(s)
  const moviesWithPosters = await Promise.all(
    movies.map(async (movie: Omit<Movie, "poster">) => {
      try {
        const posterRes = await axios.get(
          `${BASE_URL}/api/MoviePoster/GetByMovieId/${movie.id}`
        );
        return { ...movie, poster: posterRes.data };
      } catch (error) {
        console.error(`Failed to fetch poster for movie ${movie.id}`, error);
        return { ...movie, poster: null };
      }
    })
  );

  return moviesWithPosters;
};

// Fetch a single movie by id with poster
export const getMovieById = async (id: number | string): Promise<Movie> => {
  const res = await axios.get(`${BASE_URL}/api/movie/${id}`);
  const movie = res.data;

  try {
    const posterRes = await axios.get(`${BASE_URL}/api/MoviePoster/GetByMovieId/${movie.id}`);
    return { ...movie, poster: posterRes.data };
  } catch (error) {
    console.error(`Failed to fetch poster for movie ${movie.id}`, error);
    return { ...movie, poster: null };
  }
};

// Fetch movie schedule details
export const getMovieScheduleDetails = async (movieId: number) => {
  const res = await fetch(`${BASE_URL}/api/MovieSchedule/GetByMovieId/${movieId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch movie schedule");
  }
  return res.json();
};

// ✅ Fetch all theaters from API
export const getTheaters = async (): Promise<Theater[]> => {
  const res = await axios.get(`${BASE_URL}/api/theaters`);
  return res.data;
};
