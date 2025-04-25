import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleService } from '../../Services/RoleService';
import "../../../index.css";

const RoleFormPage: React.FC = () => {
    const { id: urlId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewRole = urlId === 'new' || !urlId;
    const roleName = isNewRole ? '' : decodeURIComponent(urlId || '');
    const pageTitle = isNewRole ? 'Create New Role' : 'Role Details';

    const [role, setRole] = useState<string>(roleName);
    const [isLoading, setIsLoading] = useState(!isNewRole);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(isNewRole);

    // If editing an existing role, verify it exists
    useEffect(() => {
        const verifyRole = async () => {
            if (!isNewRole) {
                try {
                    setIsLoading(true);
                    const roles = await RoleService.getRoles();
                    if (!roles.includes(roleName)) {
                        setError('Role not found.');
                    }
                } catch (err) {
                    setError('Failed to verify role exists.');
                    console.error('Error verifying role:', err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        verifyRole();
    }, [isNewRole, roleName]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRole(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Validate form data
            if (!role.trim()) {
                setError('Please provide a role name.');
                setIsSaving(false);
                return;
            }

            if (isNewRole) {
                // Create new role
                await RoleService.createRole(role);
                setSuccessMessage('Role created successfully!');

                // Redirect back to roles list after a delay
                setTimeout(() => {
                    navigate('/admin/roles');
                }, 2000);
            } else {
                // Update existing role
                await RoleService.updateRole(roleName, role);
                setSuccessMessage('Role updated successfully!');
                setIsEditMode(false);

                // Redirect to the new role URL if name changed
                if (roleName !== role) {
                    setTimeout(() => {
                        navigate(`/admin/roles/${encodeURIComponent(role)}`);
                    }, 2000);
                }
            }
        } catch (err) {
            setError(isNewRole ? 'Failed to create role.' : 'Failed to update role.');
            console.error('Error saving role:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle role deletion
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            try {
                setIsSaving(true);
                await RoleService.deleteRole(roleName);
                setSuccessMessage('Role deleted successfully!');

                // Redirect back to roles list after a delay
                setTimeout(() => {
                    navigate('/admin/roles');
                }, 2000);
            } catch (err) {
                setError('Failed to delete role.');
                console.error('Error deleting role:', err);
                setIsSaving(false);
            }
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error && !isNewRole && !roleName) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>{error}</p>
                <button
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/admin/roles')}
                >
                    Return to Roles List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {isNewRole ? pageTitle : isEditMode ? 'Update Role' : pageTitle}
                </h1>
                <div>
                    {!isNewRole && !isEditMode && (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded"
                        >
                            Edit Role
                        </button>
                    )}
                    {!isNewRole && isEditMode && (
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

            {(isEditMode || isNewRole) ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Name */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={role}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-between space-x-4 pt-4">
                        <div>
                            {!isNewRole && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                    disabled={isSaving}
                                >
                                    Delete Role
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (isNewRole) {
                                        navigate('/admin/roles');
                                    } else {
                                        setIsEditMode(false);
                                    }
                                }}
                                className="bg-emerald-600 text-white px-4 py-2 rounded"
                                disabled={isSaving}
                            >
                                {isNewRole ? 'Cancel' : 'Back to View'}
                            </button>
                            <button
                                type="submit"
                                className="bg-summit text-white px-4 py-2 rounded"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : isNewRole ? 'Create Role' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* View mode */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div>
                            <h3 className="text-sm text-gray-500">Role Name</h3>
                            <p className="font-medium">{roleName}</p>
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => navigate('/admin/roles')}
                            className="bg-summit text-white px-4 py-2 rounded"
                        >
                            Back to Roles
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleFormPage;