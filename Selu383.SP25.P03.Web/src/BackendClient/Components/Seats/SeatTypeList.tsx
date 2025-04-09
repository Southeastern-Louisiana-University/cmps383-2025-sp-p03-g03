import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import "../BackendCSS/Backend.css";
import { SeatTypeDTO } from '../../../Services/SeatTypeService';

interface SeatTypeListProps {
    seatTypes?: SeatTypeDTO[];
    onDelete?: (id: number) => Promise<void>;
}

const SeatTypeList: React.FC<SeatTypeListProps> = ({ seatTypes = [], onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSeatTypes, setFilteredSeatTypes] = useState<SeatTypeDTO[]>(seatTypes);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Filter seat types when search term or seat types list changes
    useEffect(() => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const filtered = seatTypes.filter(type =>
                type.seatTypes?.toLowerCase().includes(term)
            );
            setFilteredSeatTypes(filtered);
        } else {
            setFilteredSeatTypes(seatTypes);
        }
    }, [searchTerm, seatTypes]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = async (id: number) => {
        if (onDelete) {
            try {
                await onDelete(id);
                setDeleteConfirmId(null);
            } catch (error) {
                console.error("Error deleting seat type:", error);
            }
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmId(null);
    };

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Seat Types</h1>
                <Link to="/admin/seat-types/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Seat Type
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search seat types..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search seat types"
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSeatTypes.length > 0 ? (
                            filteredSeatTypes.map(seatType => (
                                <tr key={seatType.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{seatType.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{seatType.seatTypes || '-'}</td>
                                    <td className="px-6 py-4 text-sm font-medium flex items-center">
                                        <Link to={`/admin/seat-types/${seatType.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        {deleteConfirmId === seatType.id ? (
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => confirmDelete(seatType.id)}
                                                    className="text-red-600 hover:text-red-900 mr-2"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={cancelDelete}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleDeleteClick(seatType.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr key="no-seat-types-found">
                                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No seat types found matching your search criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SeatTypeList;