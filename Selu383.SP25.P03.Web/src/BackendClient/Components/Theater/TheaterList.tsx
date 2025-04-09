import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Plus, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import "../BackendCSS/Backend.css";
import { TheaterDTO } from '../../../Services/TheaterService';

interface TheaterListProps {
    theaters?: TheaterDTO[];
}

const TheaterList: React.FC<TheaterListProps> = ({ theaters = [] }) => {
    const [filteredTheaters, setFilteredTheaters] = useState<TheaterDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof TheaterDTO | 'manager'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter and sort theaters
    useEffect(() => {
        let result = [...theaters];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(theater =>
                theater.name.toLowerCase().includes(term) ||
                (theater.city && theater.city.toLowerCase().includes(term)) ||
                (theater.state && theater.state.toLowerCase().includes(term))
            );
        }

        result.sort((a, b) => {
            const valueA: unknown = a[sortColumn as keyof TheaterDTO];
            const valueB: unknown = b[sortColumn as keyof TheaterDTO];

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

        setFilteredTheaters(result);
    }, [theaters, searchTerm, sortColumn, sortDirection]);

    const toggleSort = (column: keyof TheaterDTO | 'manager') => {
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

    const totalPages = Math.ceil(filteredTheaters.length / recordsPerPage);
    const displayedTheaters = filteredTheaters.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Theaters</h1>
                <Link to="/admin/theaters/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Theater
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search theaters..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search theaters"
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            {['active', 'name', 'city', 'state'].map(column => (
                                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => toggleSort(column as keyof TheaterDTO | 'manager')}>
                                    <div className="flex items-center">
                                        <span>{column.charAt(0).toUpperCase() + column.slice(1)}</span>
                                        <span className="ml-1">
                                            {sortColumn === column && (
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
                        {displayedTheaters.length > 0 ? (
                            displayedTheaters.map(theater => (
                                <tr key={theater.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center">
                                        {theater.active ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                        <span className="ml-2 text-sm text-gray-500">{theater.active ? 'Active' : 'Inactive'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{theater.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{theater.city || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{theater.state || '-'}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link to={`/admin/theaters/${theater.id}`} className="text-blue-600 hover:text-blue-900"><Edit className="h-5 w-5" /></Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No theaters found matching your search criteria
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

export default TheaterList;