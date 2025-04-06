import React, { useState, useEffect } from 'react';
import { SeatTypeService, SeatTypeDTO } from '../../../Services/SeatTypeService';
import { useParams, useNavigate } from 'react-router-dom';
import "../BackendCSS/Backend.css";

const SeatTypeForm: React.FC = () => {
    const { id: urlId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewSeatType = urlId === 'new' || !urlId;
    const seatTypeId = isNewSeatType ? 0 : parseInt(urlId || '0');
    const pageTitle = isNewSeatType ? 'Create New Seat Type' : 'Edit Seat Type';

    const [seatType, setSeatType] = useState<SeatTypeDTO>({
        id: 0,
        seatTypes: ''
    });

    const [isLoading, setIsLoading] = useState(!isNewSeatType);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadSeatType = async () => {
            if (!isNewSeatType) {
                try {
                    setIsLoading(true);
                    const data = await SeatTypeService.getById(seatTypeId);
                    setSeatType(data);
                    setError(null);
                } catch (err) {
                    setError('Failed to load seat type data. Please try again.');
                    console.error('Error loading seat type:', err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadSeatType();
    }, [isNewSeatType, seatTypeId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSeatType(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (!seatType.seatTypes) {
                setError('Seat type name is required.');
                setIsSaving(false);
                return;
            }

            if (isNewSeatType) {
                // Create new seat type
                await SeatTypeService.create({ seatTypes: seatType.seatTypes });
                setSuccessMessage('Seat type created successfully!');
            } else {
                // Update existing seat type
                await SeatTypeService.update(seatTypeId, seatType);
                setSuccessMessage('Seat type updated successfully!');
            }

            // Redirect back to seat types list after a delay
            setTimeout(() => {
                navigate('/admin/seat-types');
            }, 1500);
        } catch (err) {
            setError(isNewSeatType
                ? 'Failed to create seat type. Please try again.'
                : 'Failed to update seat type. Please try again.');
            console.error('Error saving seat type:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                    <span className="text-green-700">{successMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="seatTypes" className="block text-sm font-medium text-gray-700">
                        Seat Type Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="seatTypes"
                        name="seatTypes"
                        value={seatType.seatTypes || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., Regular, VIP, Accessible"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Enter a name for this seat type (e.g., Standard, Premium, Handicap)
                    </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/seat-types')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : isNewSeatType ? 'Create Seat Type' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SeatTypeForm;