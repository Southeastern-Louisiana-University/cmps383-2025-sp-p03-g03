import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Plus, Edit, ChevronUp, ChevronDown, Info } from 'lucide-react';
import { MovieScheduleDTO, Movie } from '../../../Services/MovieScheduleService';
import "../../../index.css";

interface MovieScheduleListProps {
    schedules?: MovieScheduleDTO[];
    movies?: Movie[];
}

const MovieScheduleList: React.FC<MovieScheduleListProps> = ({ schedules = [], movies = [] }) => {
    const [filteredSchedules, setFilteredSchedules] = useState<MovieScheduleDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof MovieScheduleDTO | 'movie'>('movieId');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Helper to get movie title from ID
    const getMovieTitle = useCallback((movieId: number) => {
        return movies.find(m => m.id === movieId)?.title || 'Unknown';
    }, [movies]);

    // Helper to format movie times for display
    const formatMovieTimes = useCallback((movieTimes: string[]) => {
        if (!movieTimes || movieTimes.length === 0) return 'No times scheduled';

        // If there are more than 3 times, just show the count
        if (movieTimes.length > 3) {
            return `${movieTimes.length} showtimes scheduled`;
        }

        // Format each time for display (show only time, not date)
        return movieTimes.map(time => {
            const date = new Date(time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }).join(', ');
    }, []);

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter and sort schedules
    useEffect(() => {
        let result = [...schedules];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(schedule =>
                getMovieTitle(schedule.movieId).toLowerCase().includes(term)
            );
        }

        result.sort((a, b) => {
            let valueA: unknown = a[sortColumn as keyof MovieScheduleDTO];
            let valueB: unknown = b[sortColumn as keyof MovieScheduleDTO];

            if (sortColumn === 'movie') {
                valueA = getMovieTitle(a.movieId);
                valueB = getMovieTitle(b.movieId);
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
                const strA = String(valueA);
                const strB = String(valueB);
                return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            }
        });

        setFilteredSchedules(result);
    }, [schedules, searchTerm, sortColumn, sortDirection, getMovieTitle]);

    const toggleSort = (column: keyof MovieScheduleDTO | 'movie') => {
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

    const totalPages = Math.ceil(filteredSchedules.length / recordsPerPage);
    const displayedSchedules = filteredSchedules.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Movie Schedules</h1>
                <Link to="/admin/movieschedules/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Movie Schedule
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search movie schedules..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search movie schedules"
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => toggleSort('isActive')}
                            >
                                <div className="flex items-center">
                                    <span>Status</span>
                                    <span className="ml-1">
                                        {sortColumn === 'isActive' && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp className="w-4 h-4" />
                                                : <ChevronDown className="w-4 h-4" />
                                        )}
                                    </span>
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => toggleSort('movie')}
                            >
                                <div className="flex items-center">
                                    <span>Movie</span>
                                    <span className="ml-1">
                                        {sortColumn === 'movie' && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp className="w-4 h-4" />
                                                : <ChevronDown className="w-4 h-4" />
                                        )}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Showtimes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Theater Rooms
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedSchedules.length > 0 ? (
                            displayedSchedules.map(schedule => (
                                <tr key={schedule.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center">
                                        {schedule.isActive ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                        <span className="ml-2 text-sm text-gray-500">{schedule.isActive ? 'Active' : 'Inactive'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {getMovieTitle(schedule.movieId)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatMovieTimes(schedule.movieTimes)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/admin/movieschedules/${schedule.id}/assignments`}
                                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                        >
                                            <Info className="h-4 w-4 mr-1" />
                                            <span className="text-sm">View Assignments</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link to={`/admin/movieschedules/${schedule.id}`} className="text-blue-600 hover:text-blue-900">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No movie schedules found matching your search criteria
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
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MovieScheduleList;