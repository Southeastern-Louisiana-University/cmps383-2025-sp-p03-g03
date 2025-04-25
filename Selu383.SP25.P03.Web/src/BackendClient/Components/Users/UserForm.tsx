import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserManagementService, UserDTO, CreateUserDTO } from '../../../Services/UserManagementService';
import "../../../index.css";

const UserFormPage: React.FC = () => {
    const { id: urlId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewUser = urlId === 'new' || !urlId;
    const userId = isNewUser ? 0 : parseInt(urlId || '0');
    const pageTitle = isNewUser ? 'Create New User' : 'User Details';

    // Form state
    const [user, setUser] = useState<UserDTO>({
        id: 0,
        userName: '',
        roles: []
    });

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    // UI state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(isNewUser);

    // Load roles and user data if editing
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Always load available roles using UserManagementService.getRoles
                let rolesData: string[] = [];
                try {
                    rolesData = await UserManagementService.getRoles();
                    setAvailableRoles(rolesData);
                } catch (rolesErr) {
                    console.error('Error loading roles:', rolesErr);
                    setError('Failed to load available roles.');
                }

                // For existing user, load user data
                if (!isNewUser) {
                    try {
                        const userData = await UserManagementService.getById(userId);
                        setUser(userData);
                        setSelectedRoles(userData.roles || []);
                    } catch (userErr) {
                        console.error(`Error loading user with ID ${userId}:`, userErr);
                        setError('Failed to load user data. Please check if the user exists.');
                    }
                }
            } catch (err) {
                console.error('Error in loadData:', err);
                setError('An unexpected error occurred while loading data.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [userId, isNewUser]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'userName') {
            setUser(prev => ({ ...prev, userName: value }));
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }
    };

    // Handle role selection
    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;

        if (checked) {
            setSelectedRoles(prev => [...prev, value]);
        } else {
            setSelectedRoles(prev => prev.filter(role => role !== value));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        // Reset error
        setError(null);

        // Validate username
        if (!user.userName.trim()) {
            setError('Username is required.');
            return false;
        }

        // For new users, validate password
        if (isNewUser) {
            if (!password) {
                setError('Password is required.');
                return false;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return false;
            }

            if (password.length < 8) {
                setError('Password must be at least 8 characters long.');
                return false;
            }
        }

        // Validate roles
        if (selectedRoles.length === 0) {
            setError('At least one role must be selected.');
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            if (isNewUser) {
                // Create new user
                const newUser: CreateUserDTO = {
                    username: user.userName,
                    password: password,
                    roles: selectedRoles
                };

                await UserManagementService.create(newUser);
                setSuccessMessage('User created successfully!');

                // Redirect back to users list after a delay
                setTimeout(() => {
                    navigate('/admin/users');
                }, 2000);
            } else {
                // Update existing user roles using UserManagementService.updateRoles
                await UserManagementService.updateRoles(userId, selectedRoles);
                setSuccessMessage('User roles updated successfully!');
                setIsEditMode(false);

                // Update local user state
                setUser(prev => ({ ...prev, roles: selectedRoles }));
            }
        } catch (err) {
            setError(isNewUser ? 'Failed to create user.' : 'Failed to update user roles.');
            console.error('Error saving user:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle user deletion
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete user "${user.userName}"?`)) {
            try {
                setIsSaving(true);
                await UserManagementService.delete(userId);
                setSuccessMessage('User deleted successfully!');

                // Redirect back to users list after a delay
                setTimeout(() => {
                    navigate('/admin/users');
                }, 2000);
            } catch (err) {
                setError('Failed to delete user.');
                console.error('Error deleting user:', err);
                setIsSaving(false);
            }
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error && !isNewUser && !user.id) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>{error}</p>
                <button
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/admin/users')}
                >
                    Return to Users List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {isNewUser ? pageTitle : isEditMode ? 'Update User Roles' : pageTitle}
                </h1>
                <div>
                    {!isNewUser && !isEditMode && (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded"
                        >
                            Edit User
                        </button>
                    )}
                    {!isNewUser && isEditMode && (
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

            {(isEditMode || isNewUser) ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={user.userName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                            disabled={!isNewUser} // Only allow editing username for new users
                        />
                    </div>

                    {/* Password fields (only for new users) */}
                    {isNewUser && (
                        <>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Roles <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2 border border-gray-300 rounded-md p-3">
                            {availableRoles.length > 0 ? (
                                availableRoles.map(role => (
                                    <div key={role} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`role-${role}`}
                                            name={`role-${role}`}
                                            value={role}
                                            checked={selectedRoles.includes(role)}
                                            onChange={handleRoleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <label htmlFor={`role-${role}`} className="ml-2">
                                            {role}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No roles available</p>
                            )}
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-between space-x-4 pt-4">
                        <div>
                            {!isNewUser && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                    disabled={isSaving}
                                >
                                    Delete User
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (isNewUser) {
                                        navigate('/admin/users');
                                    } else {
                                        setIsEditMode(false);
                                    }
                                }}
                                className="bg-emerald-600 text-white px-4 py-2 rounded"
                                disabled={isSaving}
                            >
                                {isNewUser ? 'Cancel' : 'Back to View'}
                            </button>
                            <button
                                type="submit"
                                className="bg-summit text-white px-4 py-2 rounded"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : isNewUser ? 'Create User' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* View mode */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div>
                            <h3 className="text-sm text-gray-500">Username</h3>
                            <p className="font-medium">{user.userName}</p>
                        </div>
                    </div>

                    {/* Roles */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Assigned Roles</h2>
                        {user.roles && user.roles.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {user.roles.map(role => (
                                    <li key={role} className="py-1">
                                        {role}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No roles assigned</p>
                        )}
                    </div>

                    {/* Back button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="bg-summit text-white px-4 py-2 rounded"
                        >
                            Back to Users
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFormPage;