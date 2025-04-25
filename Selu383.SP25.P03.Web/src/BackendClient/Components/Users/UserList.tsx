import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {  Plus, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import "../../../index.css"

interface UserDTO {
    id: number;
    userName: string;
    roles?: string[];
}

interface UserListProps {
    users?: UserDTO[];
}

const UserList: React.FC<UserListProps> = ({ users = [] }) => {
    const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof UserDTO | 'role'>('userName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Helper to get role name - returns a comma-separated list of roles or "No roles"
    const getRoleName = useCallback((roles?: string[]) => {
        return roles && roles.length > 0 ? roles.join(', ') : 'No roles';
    }, []);

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter and sort users
    useEffect(() => {
        let result = [...users];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(user =>
                user.userName.toLowerCase().includes(term) ||
                (user.roles && user.roles.some(role => role.toLowerCase().includes(term)))
            );
        }

        result.sort((a, b) => {
            let valueA: unknown = a[sortColumn as keyof UserDTO];
            let valueB: unknown = b[sortColumn as keyof UserDTO];

            if (sortColumn === 'role') {
                valueA = getRoleName(a.roles);
                valueB = getRoleName(b.roles);
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

        setFilteredUsers(result);
    }, [users, searchTerm, sortColumn, sortDirection, getRoleName]);

    const toggleSort = (column: keyof UserDTO | 'role') => {
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

    const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
    const displayedUsers = filteredUsers.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
                <Link to="/admin/users/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add User
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search users..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search users"
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => toggleSort('id')}
                            >
                                <div className="flex items-center">
                                    <span>ID</span>
                                    <span className="ml-1">
                                        {sortColumn === 'id' && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp className="w-4 h-4" />
                                                : <ChevronDown className="w-4 h-4" />
                                        )}
                                    </span>
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => toggleSort('userName')}
                            >
                                <div className="flex items-center">
                                    <span>Username</span>
                                    <span className="ml-1">
                                        {sortColumn === 'userName' && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp className="w-4 h-4" />
                                                : <ChevronDown className="w-4 h-4" />
                                        )}
                                    </span>
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => toggleSort('role')}
                            >
                                <div className="flex items-center">
                                    <span>Roles</span>
                                    <span className="ml-1">
                                        {sortColumn === 'role' && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp className="w-4 h-4" />
                                                : <ChevronDown className="w-4 h-4" />
                                        )}
                                    </span>
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedUsers.length > 0 ? (
                            displayedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.userName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{getRoleName(user.roles)}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link to={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-900">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No users found matching your search criteria
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

export default UserList;