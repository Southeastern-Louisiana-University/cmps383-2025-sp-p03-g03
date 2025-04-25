import React, { useState, useEffect } from 'react';
import { UserManagementService, UserDTO } from '../../../Services/UserManagementService';
import UserList from './UserList';
import { AlertCircle } from 'lucide-react';
import "../../../index.css"

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all required data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersData = await UserManagementService.getAll();
                console.log('Fetched users data:', usersData);

                if (Array.isArray(usersData)) {
                    setUsers(usersData);
                } else if (usersData) {
                    // If it's not an array but contains some data, convert to array
                    setUsers([usersData]);
                } else {
                    setUsers([]);
                }
                setError(null);
            } catch (err) {
                setError('Failed to load users. Please try again later.');
                console.error('Error fetching data:', err);
                setUsers([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Optional: Handle delete user
    //const handleDeleteUser = async (id: number) => {
    //    try {
    //        await UserManagementService.delete(id);
    //        setUsers(users.filter(user => user.id !== id));
    //    } catch (err) {
    //        setError('Failed to delete user. Please try again.');
    //        console.error('Error deleting user:', err);
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

            <UserList
                users={users}
            //onDelete={handleDeleteUser}
            />
        </div>
    );
};

export default UserListPage;