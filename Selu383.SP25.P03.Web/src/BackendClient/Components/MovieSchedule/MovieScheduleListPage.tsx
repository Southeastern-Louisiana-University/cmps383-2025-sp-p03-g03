import React, { useState, useEffect } from 'react';
import { MovieScheduleService, MovieService, MovieScheduleDTO, Movie } from '../../../Services/MovieScheduleService';
import MovieScheduleList from './MovieScheduleList';
import { AlertCircle } from 'lucide-react';
import "../../../index.css";

const MovieScheduleListPage: React.FC = () => {
    const [schedules, setSchedules] = useState<MovieScheduleDTO[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all required data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [schedulesData, moviesData] = await Promise.all([
                    MovieScheduleService.getAll(),
                    MovieService.getAll()
                ]);

                setSchedules(schedulesData);
                setMovies(moviesData);
                setError(null);
            } catch (err) {
                setError('Failed to load movie schedules. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    //// Optional: Handle toggle active status
    //const handleToggleActive = async (id: number, isActive: boolean) => {
    //    try {
    //        const updatedSchedule = await MovieScheduleService.toggleActive(id, isActive);
    //        setSchedules(schedules.map(schedule => schedule.id === id ? updatedSchedule : schedule));
    //    } catch (err) {
    //        setError('Failed to update schedule status. Please try again.');
    //        console.error('Error updating schedule status:', err);
    //    }
    //};

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            <MovieScheduleList
                schedules={schedules}
                movies={movies}
            />
        </div>
    );
};

export default MovieScheduleListPage;