import axios from 'axios';

// TypeScript interfaces
export interface MovieDTO {
    id: number;
    title: string;
    description: string;
    category: string;
    runtime: number;
    isActive: boolean;
    ageRating: string;
    releaseDate: Date;
    poster?: MoviePosterDTO;
}

export interface MoviePosterDTO {
    id: number;
    name: string;
    description?: string;
    imageData: string; // Changed from Uint8Array to string for base64 data
    imageType?: string;
    movieId: number;
}

// Reference to logger from the imported module
import { logger } from '../Services/LoggerForServices'; // Adjust path as needed

// Add request/response interceptors for debugging
axios.interceptors.request.use(
    config => {
        logger.request(
            config.method?.toUpperCase() || 'UNKNOWN',
            config.url || 'UNKNOWN URL',
            config.data || null
        );
        return config;
    },
    error => {
        logger.error('Request failed to send', error);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        logger.success(`Response received [${response.status}] from ${response.config.url}`);
        return response;
    },
    error => {
        if (error.response) {
            logger.error(`API Error [${error.response.status}] from ${error.config?.url}`, error);
        } else if (error.request) {
            logger.error('No response received from server', error);
        } else {
            logger.error('Request configuration error', error);
        }
        return Promise.reject(error);
    }
);

// Base API URLs
const MOVIE_API_URL = '/api/Movie';
const MOVIE_POSTER_GET_API_URL = '/api/MoviePoster/GetByMovieId';
const MOVIE_POSTER_POST_API_URL = '/api/MoviePoster';

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string): never => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with an error status
            logger.error(
                `${context} failed with status ${error.response.status}`,
                error
            );
        } else if (error.request) {
            // Request was made but no response
            logger.error(
                `${context} failed - no response received from server`,
                error
            );
        } else {
            // Error in setting up the request
            logger.error(
                `${context} failed - request setup error`,
                error
            );
        }
    } else {
        // Non-Axios error
        logger.error(
            `${context} failed with non-axios error`,
            error
        );
    }
    throw error;
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};



// Movie service methods
export const MovieService = {
    // Get all movies
    getAll: async (): Promise<MovieDTO[]> => {
        try {
            logger.info(`Fetching all movies from ${MOVIE_API_URL}`);

            // Add timestamp to URL to prevent caching issues
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${MOVIE_API_URL}${cacheBuster}`;

            const response = await axios.get<MovieDTO[]>(url);

            // Log response details
            logger.success(`Retrieved ${response.data.length} movies`);
            if (response.data.length === 0) {
                logger.warn('No movies returned from API');
            } else {
                logger.info('First few movies:', response.data.slice(0, 3));
            }

            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all movies');
        }
    },

    // Get a single movie by ID
    getById: async (id: number): Promise<MovieDTO> => {
        try {
            logger.info(`Fetching movie with ID ${id}`);
            const response = await axios.get<MovieDTO>(`${MOVIE_API_URL}/${id}`);
            logger.success(`Retrieved movie ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching movie with ID ${id}`);
        }
    },

    // Create a new movie
    create: async (movie: Omit<MovieDTO, 'id'>): Promise<MovieDTO> => {
        try {
            logger.info('Creating new movie', movie);
            const response = await axios.post<MovieDTO>(MOVIE_API_URL, movie);
            logger.success('Movie created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new movie');
        }
    },

    // Update an existing movie
    update: async (id: number, movie: MovieDTO): Promise<MovieDTO> => {
        try {
            logger.info(`Updating movie ${id}`, movie);
            const response = await axios.put<MovieDTO>(`${MOVIE_API_URL}/${id}`, movie);
            logger.success(`Movie ${id} updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating movie ${id}`);
        }
    },

    // Delete a movie
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting movie ${id}`);
            await axios.delete(`${MOVIE_API_URL}/${id}`);
            logger.success(`Movie ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting movie ${id}`);
        }
    },

    // Toggle movie active status
    toggleActive: async (id: number, isActive: boolean): Promise<MovieDTO> => {
        try {
            logger.info(`Toggling active status of movie ${id} to ${isActive}`);

            // Construct the proper payload
            const payload = { isActive: isActive };

            const response = await axios.patch<MovieDTO>(`${MOVIE_API_URL}/${id}/toggle-active`, payload);

            logger.success(`Movie ${id} active status toggled to ${isActive}`);

            return response.data;
        } catch (error) {
            return handleApiError(error, `Toggling active status for movie ${id}`);
        }
    },
};

// Movie Poster service methods
export const MoviePosterService = {
    // Get posters by movie ID - returns array of MoviePosterDTO
    getByMovieId: async (movieId: number): Promise<MoviePosterDTO[]> => {
        try {
            logger.info(`Fetching posters for movie ID ${movieId}`);
            const response = await axios.get<MoviePosterDTO[]>(`${MOVIE_POSTER_GET_API_URL}/${movieId}`);
            logger.success(`Retrieved ${response.data.length} posters for movie ${movieId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                logger.info(`No posters found for movie ${movieId}`);
                return [];
            }
            return handleApiError(error, `Fetching posters for movie ID ${movieId}`);
        }
    },


    upload: async (file: File, movieId: number, name: string, description?: string): Promise<MoviePosterDTO> => {
        try {
            logger.info(`Uploading poster for movie ID ${movieId}`);

            // Convert file to base64
            const base64Data = await fileToBase64(file);

            // Create request payload
            const payload = {
                movieId: movieId,
                name: name,
                description: description || '',
                imageData: base64Data.split(',')[1], // Remove the data:image/jpeg;base64, prefix
                imageType: file.type
            };

            const response = await axios.post<MoviePosterDTO>(`${MOVIE_POSTER_POST_API_URL}`, payload);

            logger.success(`Poster uploaded successfully for movie ${movieId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Uploading poster for movie ID ${movieId}`);
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting movie poster ${id}`);
            await axios.delete(`${MOVIE_POSTER_POST_API_URL}/${id}`);
            logger.success(`Movie poster ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting movie poster ${id}`);
        }
    }
};