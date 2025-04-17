import React, { useState, useEffect } from 'react';
import { MovieScheduleDTO, Movie, MovieScheduleService, MovieService } from '../../../Services/MovieScheduleService';
import { useParams, useNavigate } from 'react-router-dom';
import "../../../index.css";

const MovieScheduleForm: React.FC = () => {
    const { id: urlId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewSchedule = urlId === 'new' || !urlId;
    const scheduleId = isNewSchedule ? 0 : parseInt(urlId || '0');
    const pageTitle = isNewSchedule ? 'Create New Movie Schedule' : 'Movie Schedule Details';

    // Main form state
    const [schedule, setSchedule] = useState<MovieScheduleDTO>({
        id: 0,
        movieId: 0,
        isActive: true,
        movieTimes: []
    });

    // Reference data
    const [movies, setMovies] = useState<Movie[]>([]);

    // UI state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(isNewSchedule);
    const [movieTitle, setMovieTitle] = useState('');

    // For managing multiple showtimes
    const [showTimes, setShowTimes] = useState<string[]>([""]);

    // Load reference data (movies) and schedule data if editing
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (isNewSchedule) {
                    // For new schedule, just load movies
                    const moviesData = await MovieService.getActive();
                    setMovies(moviesData);
                } else {
                    // For existing schedule, load schedule data along with movies
                    const [scheduleData, moviesData] = await Promise.all([
                        MovieScheduleService.getById(scheduleId),
                        MovieService.getAll()
                    ]);

                    setSchedule(scheduleData);
                    setMovies(moviesData);

                    // Find and store the movie title for view mode
                    const matchingMovie = moviesData.find(movie => movie.id === scheduleData.movieId);
                    if (matchingMovie) setMovieTitle(matchingMovie.title);

                    // Format showtimes for form fields
                    if (scheduleData.movieTimes && scheduleData.movieTimes.length > 0) {
                        // Convert ISO date strings to local datetime-local format
                        const formattedTimes = scheduleData.movieTimes.map(time => {
                            const date = new Date(time);
                            return formatDateTimeForInput(date);
                        });
                        setShowTimes(formattedTimes);
                    }
                }
            } catch (err) {
                setError(isNewSchedule ? 'Failed to load reference data.' : 'Failed to load schedule data.');
                console.error('Error loading data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [scheduleId, isNewSchedule]);

    // Helper to format datetime for datetime-local input
    const formatDateTimeForInput = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Helper to format datetime for display
    const formatDateTimeForDisplay = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setSchedule(prev => ({ ...prev, [name]: checked }));
            return;
        }

        // For select inputs that should be numbers
        if (name === 'movieId') {
            setSchedule(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
            return;
        }

        // For all other inputs
        setSchedule(prev => ({ ...prev, [name]: value }));
    };

    // Handle showtime changes
    const handleShowtimeChange = (index: number, value: string) => {
        const updatedShowtimes = [...showTimes];
        updatedShowtimes[index] = value;
        setShowTimes(updatedShowtimes);
    };

    // Add a new showtime field
    const addShowtime = () => {
        setShowTimes([...showTimes, ""]);
    };

    // Remove a showtime field
    const removeShowtime = (index: number) => {
        // Don't remove if it's the only showtime
        if (showTimes.length <= 1) return;

        const updatedShowtimes = showTimes.filter((_, i) => i !== index);
        setShowTimes(updatedShowtimes);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Validate form data
            if (schedule.movieId === 0) {
                setError('Please select a movie.');
                setIsSaving(false);
                return;
            }

            // Validate showtimes
            const validShowtimes = showTimes.filter(time => time.trim() !== '');
            if (validShowtimes.length === 0) {
                setError('Please add at least one showtime.');
                setIsSaving(false);
                return;
            }

            // Create a copy of the schedule for submission
            const scheduleToSubmit = {
                ...schedule,
                movieTimes: validShowtimes.map(time => new Date(time).toISOString())
            };

            let result;
            if (isNewSchedule) {
                // Create new schedule
                result = await MovieScheduleService.create(scheduleToSubmit);
                setSuccessMessage('Movie schedule created successfully!');
            } else {
                // Update existing schedule
                result = await MovieScheduleService.update(scheduleId, scheduleToSubmit);
                setSuccessMessage('Movie schedule updated successfully!');
                setIsEditMode(false); // Return to view mode after successful update
            }

            // If we've created a new schedule, update our state with the returned data
            if (isNewSchedule && result) {
                setSchedule(result);

                // Optionally redirect to the assignments page to set up theater and room assignments
                setTimeout(() => {
                    navigate(`/admin/movieschedules/${result.id}/assignments`);
                }, 2000);
            } else {
                // For updates, redirect back to schedules list after a delay
                setTimeout(() => {
                    navigate('/admin/movieschedules');
                }, 2000);
            }

        } catch (err) {
            setError(isNewSchedule ? 'Failed to create movie schedule.' : 'Failed to update movie schedule.');
            console.error('Error saving movie schedule:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error && !isNewSchedule && !schedule.id) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>{error}</p>
                <button
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/admin/movieschedules')}
                >
                    Return to Movie Schedules List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {isNewSchedule ? pageTitle : isEditMode ? 'Update Movie Schedule' : pageTitle}
                </h1>
                <div>
                    {!isNewSchedule && !isEditMode && (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded"
                        >
                            Edit Schedule
                        </button>
                    )}
                    {!isNewSchedule && isEditMode && (
                        <button
                            onClick={() => setIsEditMode(false)}
                            className="bg-red-400 text-white px-4 py-2 rounded mr-2"
                            disabled={isSaving}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {(isEditMode || isNewSchedule) ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={schedule.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="isActive" className="ml-2">Active</label>
                    </div>

                    {/* Movie Selection */}
                    <div>
                        <label htmlFor="movieId" className="block text-sm font-medium">
                            Movie <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="movieId"
                            name="movieId"
                            value={schedule.movieId}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="">Select a movie</option>
                            {movies.map(movie => (
                                <option key={movie.id} value={movie.id}>{movie.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Showtimes Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium">Showtimes</h2>
                            <button
                                type="button"
                                onClick={addShowtime}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                            >
                                Add Showtime
                            </button>
                        </div>

                        {showTimes.map((time, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="datetime-local"
                                    value={time}
                                    onChange={(e) => handleShowtimeChange(index, e.target.value)}
                                    className="flex-grow border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removeShowtime(index)}
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                    disabled={showTimes.length <= 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (isNewSchedule) {
                                    navigate('/admin/movieschedules');
                                } else {
                                    setIsEditMode(false);
                                }
                            }}
                            className="bg-emerald-600 text-white px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isNewSchedule ? 'Cancel' : 'Back to View'}
                        </button>
                        <button
                            type="submit"
                            className="bg-summit text-white px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : isNewSchedule ? 'Create Schedule' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* View mode */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className={`h-3 w-3 rounded-full mr-2 ${schedule.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{schedule.isActive ? 'Active' : 'Inactive'}</span>
                        </div>

                        <div>
                            <h3 className="text-sm text-gray-500">Movie</h3>
                            <p className="font-medium">{movieTitle}</p>
                        </div>
                    </div>

                    {/* Showtimes */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Showtimes</h2>

                        {schedule.movieTimes && schedule.movieTimes.length > 0 ? (
                            <ul className="space-y-2">
                                {schedule.movieTimes.map((time, index) => (
                                    <li key={index} className="text-sm">
                                        {formatDateTimeForDisplay(time)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No showtimes scheduled</p>
                        )}
                    </div>

                    {/* Manage Theater Room Assignments */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Theater & Room Assignments</h2>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Manage which theaters and rooms this movie is showing in
                            </p>
                            <button
                                onClick={() => navigate(`/admin/movieschedules/${schedule.id}/assignments`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Manage Assignments
                            </button>
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => navigate('/admin/movieschedules')}
                            className="bg-summit text-white px-4 py-2 rounded"
                        >
                            Back to Movie Schedules
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieScheduleForm;