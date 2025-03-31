import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Plus, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import "../BackendCSS/Backend.css";
import { RoomDTO } from '../../../Services/RoomService';

interface RoomListProps {
    rooms?: RoomDTO[];
    theaterId?: number;
}

const RoomList: React.FC<RoomListProps> = ({ rooms = [], theaterId }) => {
    const [filteredRooms, setFilteredRooms] = useState<RoomDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof RoomDTO>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter and sort rooms
    useEffect(() => {
        let result = [...rooms];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(room =>
                (room.name && room.name.toLowerCase().includes(term)) ||
                (room.screenType && room.screenType.toLowerCase().includes(term)) ||
                (room.audio && room.audio.toLowerCase().includes(term))
            );
        }

        result.sort((a, b) => {
            const valueA = a[sortColumn];
            const valueB = b[sortColumn];

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

        setFilteredRooms(result);
    }, [rooms, searchTerm, sortColumn, sortDirection]);

    const toggleSort = (column: keyof RoomDTO) => {
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

    const totalPages = Math.ceil(filteredRooms.length / recordsPerPage);
    const displayedRooms = filteredRooms.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    // Create link URL based on whether we have a theater ID
    const getNewRoomUrl = () => {
        if (theaterId) {
            return `/admin/theaters/${theaterId}/rooms/new`;
        }
        return '/admin/rooms/new';
    };

    const getRoomDetailUrl = (roomId: number) => {
        if (theaterId) {
            return `/admin/theaters/${theaterId}/rooms/${roomId}`;
        }
        return `/admin/rooms/${roomId}`;
    };

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Theater Rooms</h1>
                <Link to={getNewRoomUrl()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Room
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search rooms..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search rooms"
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            {['isActive', 'name', 'numOfSeats', 'isPremium'].map(column => (
                                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => toggleSort(column as keyof RoomDTO)}>
                                    <div className="flex items-center">
                                        <span>
                                            {column === 'isActive' ? 'Status' :
                                                column === 'name' ? 'Name' :
                                                    column === 'numOfSeats' ? 'Capacity' :
                                                        column === 'isPremium' ? 'Premium' : column}
                                        </span>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Screen Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedRooms.length > 0 ? (
                            displayedRooms.map((room, index) => (
                                <tr key={room.id || `room-${index}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center">
                                        {room.isActive ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                        <span className="ml-2 text-sm text-gray-500">{room.isActive ? 'Active' : 'Inactive'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{room.name || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{room.numOfSeats}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {room.isPremium ?
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Premium</span>
                                            : 'Standard'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{room.screenType || '-'}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link to={getRoomDetailUrl(room.id)} className="text-blue-600 hover:text-blue-900">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr key="no-rooms-found" >
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No rooms found matching your search criteria
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

export default RoomList;