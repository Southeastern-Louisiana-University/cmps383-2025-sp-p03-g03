import React, { useState, useEffect } from 'react';
import { TheaterService, TheaterDTO } from '../../../Services/TheaterService';
import TheaterList from './TheaterList';
import { AlertCircle } from 'lucide-react';
import "../BackendCSS/Backend.css";

const TheaterListPage: React.FC = () => {
    const [theaters, setTheaters] = useState<TheaterDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all theaters
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const theatersData = await TheaterService.getAll();
                setTheaters(theatersData);
                setError(null);
            } catch (err) {
                setError('Failed to load theaters. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

            <TheaterList theaters={theaters} />
        </div>
    );
};

export default TheaterListPage;