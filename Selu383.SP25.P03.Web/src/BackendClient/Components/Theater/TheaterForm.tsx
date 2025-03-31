import React, { useState, useEffect } from 'react';
import { TheaterService, TheaterDTO, UserService } from '../../../Services/TheaterService';
import { useParams, useNavigate } from 'react-router-dom';
import "../BackendCSS/Backend.css";

interface Manager {
    id: number;
    userName: string;
}

const TheaterFormPage: React.FC = () => {
    const { id: urlId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewTheater = urlId === 'new' || !urlId;
    const theaterId = isNewTheater ? 0 : parseInt(urlId || '0');
    const pageTitle = isNewTheater ? 'Create New Theater' : 'Theater Details';

    const [theater, setTheater] = useState<TheaterDTO>({
        id: 0,
        active: true,
        name: '',
        managerId: undefined
    });

    const [managers, setManagers] = useState<Manager[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(isNewTheater);
    const [managerName, setManagerName] = useState('');

    // Load reference data and theater data if editing
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (isNewTheater) {
                    // For new theater, just load managers
                    try {
                        const managersData = await UserService.getManagers();
                        setManagers(managersData);
                    } catch (managerError) {
                        console.error('Error loading managers:', managerError);
                        setManagers([]);
                    }
                } else {
                    // For existing theater, load theater data along with managers
                    const theaterData = await TheaterService.getById(theaterId);

                    // Format phone numbers if they exist
                    const formattedTheaterData = {
                        ...theaterData,
                        phone1: theaterData.phone1 ? formatPhoneNumber(theaterData.phone1) : undefined,
                        phone2: theaterData.phone2 ? formatPhoneNumber(theaterData.phone2) : undefined
                    };

                    setTheater(formattedTheaterData);

                    // Try to load managers, but don't fail if they can't be loaded
                    try {
                        const managersData = await UserService.getManagers();
                        setManagers(managersData);

                        // Find and store the manager name for view mode
                        if (theaterData.managerId) {
                            const matchingManager = managersData.find(m => m.id === theaterData.managerId);
                            if (matchingManager) setManagerName(matchingManager.userName);
                        }
                    } catch (managerError) {
                        console.error('Error loading managers:', managerError);
                        setManagers([]);
                    }
                }
            } catch (err) {
                setError(isNewTheater ? 'Failed to load reference data.' : 'Failed to load theater data.');
                console.error('Error loading data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [theaterId, isNewTheater]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setTheater(prev => ({ ...prev, [name]: checked }));
            return;
        }

        // For select inputs that should be numbers
        if (name === 'managerId') {
            setTheater(prev => ({ ...prev, [name]: value ? parseInt(value) : undefined }));
            return;
        }

        // Format phone numbers as user types
        if (name === 'phone1' || name === 'phone2') {
            // Strip all non-numeric characters
            const digits = value.replace(/\D/g, '');

            // Format the phone number as user types
            let formattedValue = '';
            if (digits.length <= 3) {
                formattedValue = digits;
            } else if (digits.length <= 6) {
                formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
            } else {
                formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
            }

            setTheater(prev => ({ ...prev, [name]: formattedValue }));
            return;
        }

        // For all other inputs
        setTheater(prev => ({ ...prev, [name]: value }));
    };

    // Format phone number for display
    const formatPhoneNumber = (phone: string | undefined): string => {
        if (!phone) return '';

        // If it's already formatted, return as is
        if (phone.includes('(') && phone.includes(')')) {
            return phone;
        }

        // Strip all non-numeric characters
        const digits = phone.replace(/\D/g, '');

        // Format the phone number
        if (digits.length < 10) {
            return phone; // Return original if not enough digits
        }

        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Validate form data
            if (!theater.name) {
                setError('Please fill in all required fields.');
                setIsSaving(false);
                return;
            }

            // Create a copy of the theater for submission
            const theaterToSubmit = {
                ...theater,
                // Clean up phone numbers before submitting
                phone1: theater.phone1 ? theater.phone1.replace(/\D/g, '') : undefined,
                phone2: theater.phone2 ? theater.phone2.replace(/\D/g, '') : undefined
            };

            let result;
            if (isNewTheater) {
                // Create new theater
                const newTheaterData = { ...theaterToSubmit };
                result = await TheaterService.create(newTheaterData);
                setSuccessMessage('Theater created successfully!');
            } else {
                // Update existing theater
                result = await TheaterService.update(theaterId, theaterToSubmit);
                setSuccessMessage('Theater updated successfully!');
                setIsEditMode(false); // Return to view mode after successful update
            }

            // If we've created a new theater, update our state with the returned data
            if (isNewTheater && result) {
                setTheater(result);
            }

            // Redirect back to theaters list after a delay
            setTimeout(() => {
                navigate('/admin/theaters');
            }, 2000);

        } catch (err) {
            setError(isNewTheater ? 'Failed to create theater.' : 'Failed to update theater.');
            console.error('Error saving theater:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error && !isNewTheater && !theater.id) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>{error}</p>
                <button
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/admin/theaters')}
                >
                    Return to Theaters List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {isNewTheater ? pageTitle : isEditMode ? 'Update Theater' : pageTitle}
                </h1>
                <div>
                    {!isNewTheater && !isEditMode && (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded"
                        >
                            Edit Theater
                        </button>
                    )}
                    {!isNewTheater && isEditMode && (
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

            {(isEditMode || isNewTheater) ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={theater.active}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="active" className="ml-2">Active</label>
                    </div>

                    {/* Theater Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                            Theater Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={theater.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Address Information</h2>

                        <div>
                            <label htmlFor="address1" className="block text-sm font-medium">
                                Address Line 1
                            </label>
                            <input
                                type="text"
                                id="address1"
                                name="address1"
                                value={theater.address1 || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="address2" className="block text-sm font-medium">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                id="address2"
                                name="address2"
                                value={theater.address2 || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={theater.city || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="state" className="block text-sm font-medium">
                                    State
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={theater.state || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="zip" className="block text-sm font-medium">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    id="zip"
                                    name="zip"
                                    value={theater.zip || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Contact Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone1" className="block text-sm font-medium">
                                    Primary Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone1"
                                    name="phone1"
                                    value={theater.phone1 || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone2" className="block text-sm font-medium">
                                    Secondary Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone2"
                                    name="phone2"
                                    value={theater.phone2 || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Manager Selection */}
                    <div>
                        <label htmlFor="managerId" className="block text-sm font-medium">
                            Theater Manager
                        </label>
                        <select
                            id="managerId"
                            name="managerId"
                            value={theater.managerId || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">Select a manager</option>
                            {managers.map(manager => (
                                <option key={manager.id} value={manager.id}>{manager.userName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (isNewTheater) {
                                    navigate('/admin/theaters');
                                } else {
                                    setIsEditMode(false);
                                }
                            }}
                            className="bg-emerald-600 text-white px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isNewTheater ? 'Cancel' : 'Back to View'}
                        </button>
                        <button
                            type="submit"
                            className="bg-summit text-white px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : isNewTheater ? 'Create Theater' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* View mode */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className={`h-3 w-3 rounded-full mr-2 ${theater.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{theater.active ? 'Active' : 'Inactive'}</span>
                        </div>

                        <div>
                            <h3 className="text-sm text-gray-500">Theater Name</h3>
                            <p className="font-medium">{theater.name}</p>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Address Information</h2>

                        <div className="grid grid-cols-1 gap-y-3">
                            <div>
                                <h3 className="text-sm text-gray-500">Address Line 1</h3>
                                <p>{theater.address1 || <span className="text-gray-400 italic">Not specified</span>}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Address Line 2</h3>
                                <p>{theater.address2 || <span className="text-gray-400 italic">Not specified</span>}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="text-sm text-gray-500">City</h3>
                                    <p>{theater.city || <span className="text-gray-400 italic">Not specified</span>}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-500">State</h3>
                                    <p>{theater.state || <span className="text-gray-400 italic">Not specified</span>}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-500">ZIP Code</h3>
                                    <p>{theater.zip || <span className="text-gray-400 italic">Not specified</span>}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Contact Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm text-gray-500">Primary Phone</h3>
                                <p>
                                    {theater.phone1 || <span className="text-gray-400 italic">Not specified</span>}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Secondary Phone</h3>
                                <p>
                                    {theater.phone2 || <span className="text-gray-400 italic">Not specified</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Manager Information */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Management</h2>

                        <div>
                            <h3 className="text-sm text-gray-500">Manager</h3>
                            <p>{managerName || <span className="text-gray-400 italic">No manager assigned</span>}</p>
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => navigate('/admin/theaters')}
                            className="bg-summit text-white px-4 py-2 rounded"
                        >
                            Back to Theaters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TheaterFormPage;