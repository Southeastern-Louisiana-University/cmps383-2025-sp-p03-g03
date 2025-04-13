// src/services/movieService.ts
import axios from "axios";
// Directly use the Azure backend URL
const BASE_URL = "https://cmps383-2025-sp25-p03-g03.azurewebsites.net";


export const getMovies = async () => {
  const res = await axios.get(`${BASE_URL}/api/movie`);
  return res.data;
};

export const getMovieById = async (id: number | string) => {
  const res = await axios.get(`${BASE_URL}/api/movie/${id}`);
  return res.data;
};
export async function getMovieScheduleDetails(movieId: number) {
  const res = await fetch(`https://cmps383-2025-sp25-p03-g03.azurewebsites.net/api/MovieSchedule/GetByMovieId/${movieId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch movie schedule");
  }
  return res.json();
}

