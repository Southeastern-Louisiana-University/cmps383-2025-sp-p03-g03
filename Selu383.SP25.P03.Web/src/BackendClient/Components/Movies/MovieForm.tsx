import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MovieService,
    MoviePosterService,
    MovieDTO
} from '../../../Services/MovieService';
import { Upload, Image, Trash2, Clock, Calendar } from 'lucide-react';
//import "../../../index.css";
import "../BackendCSS/Backend.css";

const MovieFormPage: React.FC = () => {
    const { id: urlId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewMovie = urlId === 'new' || !urlId;
    const movieId = isNewMovie ? 0 : parseInt(urlId || '0');
    const pageTitle = isNewMovie ? 'Create New Movie' : 'Movie Details';

    const [movie, setMovie] = useState<MovieDTO>({
        id: 0,
        title: '',
        description: '',
        category: '',
        runtime: 90,
        isActive: true,
        ageRating: '',
        releaseDate: new Date()
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(isNewMovie);

    const [isDeleting, setIsDeleting] = useState(false);

    // Poster handling
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [posterName, setPosterName] = useState<string>('');
    const [posterDescription, setPosterDescription] = useState<string>('');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [currentPoster, setCurrentPoster] = useState<string | null>(null);
    const [currentPosterId, setCurrentPosterId] = useState<number | null>(null);

    // Load reference data and movie data if editing
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (isNewMovie) {
                    // For new movie, just set loading to false
                    setIsLoading(false);
                } else {
                    // For existing movie, load movie data
                    try {
                        const movieData = await MovieService.getById(movieId);
                        setMovie(movieData);

                        // Load movie poster if exists
                        try {
                            const posters = await MoviePosterService.getByMovieId(movieId);

                            if (posters && posters.length > 0) {
                                const posterData = posters[0]; // Get the first poster
                                setCurrentPosterId(posterData.id);
                                setPosterName(posterData.name);
                                setPosterDescription(posterData.description || '');

                                // Set current poster using the base64 image data
                                if (posterData.imageData) {
                                    // If imageData is already a base64 string
                                    if (typeof posterData.imageData === 'string') {
                                        // Check if it already has the data:image prefix
                                        if (posterData.imageData.startsWith('data:image')) {
                                            setCurrentPoster(posterData.imageData);
                                        } else {
                                            // Add the prefix if needed
                                            setCurrentPoster(`data:image/jpeg;base64,${posterData.imageData}`);
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            console.warn('No poster found for this movie:', err);
                        }
                    } catch (err) {
                        setError('Failed to load movie data.');
                        console.error('Error loading movie data:', err);
                    } finally {
                        setIsLoading(false);
                    }
                }
            } catch (err) {
                setError(isNewMovie ? 'Failed to load reference data.' : 'Failed to load movie data.');
                console.error('Error loading data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [movieId, isNewMovie]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setMovie((prev: MovieDTO) => ({ ...prev, [name]: checked }));
            return;
        }

        // Handle numeric values
        if (name === 'runtime') {
            setMovie((prev: MovieDTO) => ({ ...prev, [name]: parseInt(value) || 0 }));
            return;
        }

        // For date inputs
        if (name === 'releaseDate') {
            setMovie((prev: MovieDTO) => ({ ...prev, [name]: new Date(value) }));
            return;
        }

        // For all other inputs
        setMovie((prev: MovieDTO) => ({ ...prev, [name]: value }));
    };

    // Handle poster file selection
    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset any previous errors
        setUploadError(null);

        // Check file type
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            setUploadError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
            return;
        }

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image is too large. Maximum size is 5MB.');
            return;
        }

        // Set the file for upload
        setPosterFile(file);

        // Automatically set poster name if empty
        if (!posterName) {
            setPosterName(file.name.split('.')[0]);
        }

        // Create a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPosterPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle deleting the current poster
    const handleDeleteCurrentPoster = async () => {
        if (!currentPosterId) return;

        try {
            setIsDeleting(true);
            setError(null);

            console.warn(currentPosterId)

            await MoviePosterService.delete(currentPosterId);

            // Clear poster data
            setCurrentPosterId(null);
            setCurrentPoster(null);
            setPosterName('');
            setPosterDescription('');

            setSuccessMessage('Poster deleted successfully.');
        } catch (err) {
            setError('Failed to delete poster. Please try again.');
            console.error('Error deleting poster:', err);
        } finally {
            setIsDeleting(false);
        }
    };


    // Handle removing the poster preview
    const handleRemovePosterPreview = () => {
        setPosterFile(null);
        setPosterPreview(null);
    };

    // Format the date for input field
    const formatDateForInput = (date: Date): string => {
        return date instanceof Date
            ? date.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);
            setUploadError(null);

            // Validate form data
            if (!movie.title || !movie.category || !movie.ageRating) {
                setError('Please fill in all required fields.');
                setIsSaving(false);
                return;
            }

            let result: MovieDTO;
            if (isNewMovie) {
                // Create new movie
                result = await MovieService.create({
                    ...movie,
                    runtime: movie.runtime || 0,
                    releaseDate: movie.releaseDate || new Date()
                });
                setSuccessMessage('Movie created successfully!');

                // Update our state with the returned data
                setMovie(result);

                // If we have a poster file, upload it
                if (posterFile) {
                    try {
                        await MoviePosterService.upload(
                            posterFile,
                            result.id,
                            posterName || posterFile.name,
                            posterDescription
                        );
                        setSuccessMessage('Movie and poster created successfully!');
                    } catch (err) {
                        console.error('Error uploading poster:', err);
                        setUploadError('Movie was created, but there was an error uploading the poster.');
                    }
                }

                // Redirect to edit page for the newly created movie after a delay
                setTimeout(() => {
                    navigate(`/admin/movies/${result.id}`, { replace: true });
                }, 2000);
            } else {
                // Update existing movie
                result = await MovieService.update(movieId, movie);

                // If we have a poster file, upload it
                if (posterFile) {
                    try {
                        await MoviePosterService.upload(
                            posterFile,
                            movieId,
                            posterName || posterFile.name,
                            posterDescription
                        );
                        setSuccessMessage('Movie and poster updated successfully!');
                    } catch (err) {
                        console.error('Error uploading poster:', err);
                        setUploadError('Movie was updated, but there was an error uploading the poster.');
                    }
                } else {
                    setSuccessMessage('Movie updated successfully!');
                }

                setIsEditMode(false); // Return to view mode after successful update
            }

        } catch (err) {
            setError(isNewMovie ? 'Failed to create movie.' : 'Failed to update movie.');
            console.error('Error saving movie:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error && !isNewMovie && !movie.id) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>{error}</p>
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/admin/movies')}
                >
                    Return to Movies List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {isNewMovie ? pageTitle : isEditMode ? 'Update Movie' : pageTitle}
                </h1>
                <div>
                    {!isNewMovie && !isEditMode && (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Edit Movie
                        </button>
                    )}
                    {!isNewMovie && isEditMode && (
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

            {uploadError && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    {uploadError}
                </div>
            )}

            {(isEditMode || isNewMovie) ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={movie.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="isActive" className="ml-2">Active</label>
                    </div>

                    {/* Movie Title and Rating Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium">
                                Movie Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={movie.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="ageRating" className="block text-sm font-medium">
                                Age Rating <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="ageRating"
                                name="ageRating"
                                value={movie.ageRating}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>
                    </div>

                    {/* Category, Runtime, Release Date Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={movie.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="runtime" className="block text-sm font-medium">
                                Runtime (minutes) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Clock className="absolute top-3 left-2 h-4 w-4 text-gray-400" />
                                <input
                                    type="number"
                                    id="runtime"
                                    name="runtime"
                                    value={movie.runtime}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="mt-1 block w-full pl-8 border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="releaseDate" className="block text-sm font-medium">
                                Release Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute top-3 left-2 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    id="releaseDate"
                                    name="releaseDate"
                                    value={formatDateForInput(movie.releaseDate)}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full pl-8 border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={movie.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    {/* Movie Poster Upload */}
                    <div className="mt-6 p-4 border border-gray-200 rounded-md">
                        <h2 className="text-lg font-medium mb-3">Movie Poster</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Poster Preview */}
                            <div className="space-y-3">
                                <div className="border rounded-md p-2 h-60 flex items-center justify-center bg-gray-50">
                                    {posterPreview ? (
                                        <div className="relative h-full w-full">
                                            <img
                                                src={posterPreview}
                                                alt="Movie poster preview"
                                                className="object-contain h-full w-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemovePosterPreview}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : currentPoster && !isNewMovie ? (
                                        <div className="relative h-full w-full">
                                            <img
                                                src={currentPoster}
                                                alt="Current movie poster"
                                                className="object-contain h-full w-full"
                                            />
                                            <div className="absolute top-2 right-2 ">
                                                    {currentPosterId && (
                                                        <button
                                                            onClick={handleDeleteCurrentPoster}
                                                            disabled={isDeleting}
                                                            className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            {isDeleting ? 'Deleting...' : 'Delete Poster'}
                                                        </button>
                                                    )}
                                            </div>

                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <Image className="h-12 w-12 mx-auto mb-2" />
                                            <p>No poster selected</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="poster" className="block text-sm font-medium mb-2">
                                        Upload Poster
                                    </label>
                                    <div className="flex items-center">
                                        <label
                                            htmlFor="poster"
                                            className="cursor-pointer bg-blue-50 border-2 border-blue-200 py-2 px-4 rounded-md flex items-center hover:bg-blue-100"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            <span>Select file</span>
                                            <input
                                                type="file"
                                                id="poster"
                                                name="poster"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePosterChange}
                                            />
                                        </label>
                                        <span className="ml-3 text-sm text-gray-500">
                                            {posterFile ? posterFile.name : "No file selected"}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Max size 5MB. JPEG, PNG, GIF, WEBP formats accepted.
                                    </p>
                                </div>
                            </div>

                            {/* Poster Metadata */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="posterName" className="block text-sm font-medium">
                                        Poster Name
                                    </label>
                                    <input
                                        type="text"
                                        id="posterName"
                                        name="posterName"
                                        value={posterName}
                                        onChange={(e) => setPosterName(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Defaults to file name if left empty
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="posterDescription" className="block text-sm font-medium">
                                        Poster Description
                                    </label>
                                    <textarea
                                        id="posterDescription"
                                        name="posterDescription"
                                        value={posterDescription}
                                        onChange={(e) => setPosterDescription(e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="Optional description for the poster"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (isNewMovie) {
                                    navigate('/admin/movies');
                                } else {
                                    setIsEditMode(false);
                                }
                            }}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isNewMovie ? 'Cancel' : 'Back to View'}
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : isNewMovie ? 'Create Movie' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* View mode */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className={`h-3 w-3 rounded-full mr-2 ${movie.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{movie.isActive ? 'Active' : 'Inactive'}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <h3 className="text-sm text-gray-500">Movie Title</h3>
                                <p className="font-medium">{movie.title}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Age Rating</h3>
                                <p className="font-medium">{movie.ageRating}</p>
                            </div>
                        </div>
                    </div>

                    {/* Movie Details */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Movie Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <h3 className="text-sm text-gray-500">Category</h3>
                                <p>{movie.category}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Runtime</h3>
                                <p>{movie.runtime} minutes</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Release Date</h3>
                                <p>{formatDateForInput(movie.releaseDate)}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm text-gray-500">Description</h3>
                            <p className="whitespace-pre-line">{movie.description}</p>
                        </div>
                    </div>

                    {/* Movie Poster */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-medium">Movie Poster</h2>
                                {currentPosterId && (
                                    <button
                                        onClick={handleDeleteCurrentPoster}
                                        disabled={isDeleting}
                                        className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        {isDeleting ? 'Deleting...' : 'Delete Poster'}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    {currentPoster ? (
                                        <div className="border rounded-md p-2 h-60 flex items-center justify-center bg-gray-50">
                                            <img
                                                src={currentPoster}
                                                alt="Movie poster"
                                                className="object-contain h-full w-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="border rounded-md p-2 h-60 flex items-center justify-center bg-gray-50">
                                            <div className="text-center text-gray-500">
                                                <Image className="h-12 w-12 mx-auto mb-2" />
                                                <p>No poster available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div>
                                        <h3 className="text-sm text-gray-500">Poster Name</h3>
                                        <p>{posterName || <span className="text-gray-400 italic">Not specified</span>}</p>
                                    </div>

                                    {posterDescription && (
                                        <div className="mt-4">
                                            <h3 className="text-sm text-gray-500">Poster Description</h3>
                                            <p>{posterDescription}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    {/* Back button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => navigate('/admin/movies')}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Back to Movies
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieFormPage;