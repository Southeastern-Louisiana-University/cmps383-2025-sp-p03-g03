import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Plus, Edit, ChevronUp, ChevronDown, Clock, CalendarIcon, Film } from 'lucide-react';
import "../../../index.css";
import { MovieDTO, MoviePosterDTO } from '../../../Services/MovieService';

interface MovieListProps {
    movies?: MovieDTO[];
}

const MovieList: React.FC<MovieListProps> = ({ movies = [] }) => {
    const [filteredMovies, setFilteredMovies] = useState<MovieDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof MovieDTO | 'category'>('title');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Helper to get category name from ID
    const getCategoryName = useCallback((category: string) => {
        return category; // Category is already a string in MovieDTO
    }, []);

    // Format date for display
    const formatDate = (date: Date): string => {
        if (!date) return '';
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString();
    };

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter and sort movies
    useEffect(() => {
        let result = [...movies];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(movie =>
                movie.title.toLowerCase().includes(term) ||
                movie.description.toLowerCase().includes(term) ||
                movie.category.toLowerCase().includes(term) ||
                movie.ageRating.toLowerCase().includes(term)
            );
        }

        result.sort((a, b) => {
            let valueA: string | number | boolean | Date | MoviePosterDTO | undefined = a[sortColumn as keyof MovieDTO];
            let valueB: string | number | boolean | Date | MoviePosterDTO | undefined = b[sortColumn as keyof MovieDTO];

            if (sortColumn === 'category') {
                valueA = getCategoryName(a.category);
                valueB = getCategoryName(b.category);
            } else if (sortColumn === 'releaseDate') {
                valueA = valueA instanceof Date ? valueA.getTime() : new Date(valueA as string).getTime();
                valueB = valueB instanceof Date ? valueB.getTime() : new Date(valueB as string).getTime();
            }

            // Handle different data types for sorting
            if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
                return sortDirection === 'asc'
                    ? (valueA === valueB ? 0 : valueA ? -1 : 1)
                    : (valueA === valueB ? 0 : valueA ? 1 : -1);
            } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                // Convert to string for string comparison
                const strA = String(valueA || '');
                const strB = String(valueB || '');
                return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            }
        });

        setFilteredMovies(result);
    }, [movies, searchTerm, sortColumn, sortDirection, getCategoryName]);

    const toggleSort = (column: keyof MovieDTO | 'category') => {
        // Reset to page 1 when sort criteria changes
        setCurrentPage(1);

        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const formatRuntime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const totalPages = Math.ceil(filteredMovies.length / recordsPerPage);
    const displayedMovies = filteredMovies.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Movies</h1>
                <Link
                    to="/admin/movies/new"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Movie
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search movies..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search movies"
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            {[
                                { key: 'isActive', label: 'Status' },
                                { key: 'title', label: 'Title' },
                                { key: 'category', label: 'Category' },
                                { key: 'runtime', label: 'Runtime' },
                                { key: 'ageRating', label: 'Rating' },
                                { key: 'releaseDate', label: 'Release Date' }
                            ].map(column => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                    onClick={() => toggleSort(column.key as keyof MovieDTO | 'category')}
                                >
                                    <div className="flex items-center">
                                        <span>{column.label}</span>
                                        <span className="ml-1">
                                            {sortColumn === column.key && (
                                                sortDirection === 'asc'
                                                    ? <ChevronUp className="w-4 h-4" />
                                                    : <ChevronDown className="w-4 h-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedMovies.length > 0 ? (
                            displayedMovies.map(movie => (
                                <tr key={movie.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center">
                                        {movie.isActive
                                            ? <CheckCircle className="h-5 w-5 text-green-500" />
                                            : <XCircle className="h-5 w-5 text-red-500" />
                                        }
                                        <span className="ml-2 text-sm text-gray-500">
                                            {movie.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{movie.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <Film className="h-4 w-4 mr-1 text-gray-500" />
                                            {getCategoryName(movie.category)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                            {formatRuntime(movie.runtime)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{movie.ageRating}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                                            {formatDate(movie.releaseDate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link
                                            to={`/admin/movies/${movie.id}/edit`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No movies found matching your search criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev: number) => prev - 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev: number) => prev + 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MovieList;