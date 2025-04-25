import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import "../../../index.css";

interface RoleListProps {
    roles?: string[];
}

const RoleList: React.FC<RoleListProps> = ({ roles = [] }) => {
    const [filteredRoles, setFilteredRoles] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter and sort roles
    useEffect(() => {
        let result = [...roles];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(role =>
                role.toLowerCase().includes(term)
            );
        }

        // Sort roles
        result.sort((a, b) => {
            return sortDirection === 'asc' ?
                a.localeCompare(b) :
                b.localeCompare(a);
        });

        setFilteredRoles(result);
    }, [roles, searchTerm, sortDirection]);

    const toggleSort = () => {
        // Reset to page 1 when sort criteria changes
        setCurrentPage(1);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const totalPages = Math.ceil(filteredRoles.length / recordsPerPage);
    const displayedRoles = filteredRoles.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Roles</h1>
                <Link to="/admin/roles/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Role
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search roles..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search roles"
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={toggleSort}
                            >
                                <div className="flex items-center">
                                    <span>Role Name</span>
                                    <span className="ml-1">
                                        {sortDirection === 'asc' ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedRoles.length > 0 ? (
                            displayedRoles.map((role, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{role}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link to={`/admin/roles/${encodeURIComponent(role)}`} className="text-blue-600 hover:text-blue-900">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No roles found matching your search criteria
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

export default RoleList;