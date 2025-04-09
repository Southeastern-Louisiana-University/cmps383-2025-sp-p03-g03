// SeatTypeListPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { SeatTypeService, SeatTypeDTO } from '../../../Services/SeatTypeService';
import SeatTypeList from './SeatTypeList';
import { AlertCircle } from 'lucide-react';
import "../BackendCSS/Backend.css";

const SeatTypeListPage: React.FC = () => {
    const [seatTypes, setSeatTypes] = useState<SeatTypeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch all seat types
    const fetchSeatTypes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await SeatTypeService.getAll();
            setSeatTypes(data);
            setError(null);
        } catch (err) {
            setError('Failed to load seat types. Please try again later.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSeatTypes();
    }, [fetchSeatTypes]);

    // Handle delete seat type
    const handleDeleteSeatType = async (id: number) => {
        try {
            await SeatTypeService.delete(id);
            setSeatTypes(prevTypes => prevTypes.filter(seatType => seatType.id !== id));
            setSuccessMessage('Seat type deleted successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Failed to delete seat type. Please try again.');
            console.error('Error deleting seat type:', err);
            setTimeout(() => setError(null), 3000);
        }
    };

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

            {successMessage && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                    <div className="flex items-center">
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                </div>
            )}

            <SeatTypeList
                seatTypes={seatTypes}
                onDelete={handleDeleteSeatType}
            />
        </div>
    );
};

export default SeatTypeListPage;