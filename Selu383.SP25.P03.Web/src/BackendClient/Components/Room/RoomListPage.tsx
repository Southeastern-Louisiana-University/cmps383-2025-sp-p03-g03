// RoomListPage.tsx
import React, { useState, useEffect } from 'react';
import { RoomService, RoomDTO } from '../../../Services/RoomService';
import { TheaterService, TheaterDTO } from '../../../Services/TheaterService';
import RoomList from './RoomList';
import { AlertCircle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import "../BackendCSS/Backend.css";

const RoomListPage: React.FC = () => {
    const { theaterId } = useParams<{ theaterId: string }>();
    const theaterIdNum = theaterId ? parseInt(theaterId) : undefined;

    const [rooms, setRooms] = useState<RoomDTO[]>([]);
    const [theater, setTheater] = useState<TheaterDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let roomsData: RoomDTO[];

                if (theaterIdNum) {
                    // Fetch rooms for a specific theater
                    [roomsData] = await Promise.all([
                        RoomService.getByTheaterId(theaterIdNum),
                        TheaterService.getById(theaterIdNum).then(setTheater)
                    ]);
                } else {
                    // Fetch all rooms
                    roomsData = await RoomService.getAll();
                }

                setRooms(roomsData);
                setError(null);
            } catch (err) {
                setError('Failed to load rooms. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [theaterIdNum]);

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

            {theater && (
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">{theater.name}</h2>
                            <p className="text-gray-500">
                                {theater.city}{theater.city && theater.state ? ', ' : ''}{theater.state}
                            </p>
                        </div>
                        <Link to={`/admin/theaters/${theater.id}`} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                            Back to Theater
                        </Link>
                    </div>
                </div>
            )}

            <RoomList rooms={rooms} theaterId={theaterIdNum} />
        </div>
    );
};

export default RoomListPage;