import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RoomService, RoomDTO } from '../../../Services/RoomService';
import { SeatDTO, SeatTypeDTO, SeatService, SeatTypeService } from '../../../Services/SeatService';
import SeatMap from './SeatMap';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const SeatManagement: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();

    const [room, setRoom] = useState<RoomDTO | null>(null);
    const [selectedSeat, setSelectedSeat] = useState<SeatDTO | null>(null);
    const [seatTypes, setSeatTypes] = useState<SeatTypeDTO[]>([]);
    const [defaultSeatTypeId, setDefaultSeatTypeId] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const roomIdNum = parseInt(roomId || '0');

    // Load room data and seat types
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load both room data and seat types in parallel
                const [roomData, seatTypesData] = await Promise.all([
                    RoomService.getById(roomIdNum),
                    SeatTypeService.getAll()
                ]);

                setRoom(roomData);
                setSeatTypes(seatTypesData);

                // Set default seat type to the first one in the list, or ID 1 if empty
                if (seatTypesData.length > 0) {
                    setDefaultSeatTypeId(seatTypesData[0].id);
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load room data or seat types.');
            } finally {
                setLoading(false);
            }
        };

        if (roomIdNum) {
            loadData();
        }
    }, [roomIdNum]);

    // Handle seat click
    const handleSeatClick = (seat: SeatDTO) => {
        setSelectedSeat(seat);
    };

    // Toggle seat availability
    const toggleSeatAvailability = async (seat: SeatDTO) => {
        try {
            const updatedSeat = { ...seat, isAvailable: !seat.isAvailable };
            await SeatService.update(seat.id, updatedSeat);

            // Reset selection and refresh
            setSelectedSeat(null);
            setSuccessMessage('Seat updated successfully!');

            // Refresh the component after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error('Error updating seat:', err);
            setError('Failed to update seat.');
        }
    };

    // Update seat type
    const updateSeatType = async (seat: SeatDTO, newSeatTypeId: number) => {
        try {
            const updatedSeat = { ...seat, seatTypeId: newSeatTypeId };
            await SeatService.update(seat.id, updatedSeat);

            // Reset selection and refresh
            setSelectedSeat(null);
            setSuccessMessage('Seat type updated successfully!');

            // Refresh the component after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error('Error updating seat type:', err);
            setError('Failed to update seat type.');
        }
    };

    // Regenerate all seats for the room
    const regenerateSeats = async () => {
        if (!room) return;

        if (!confirm('Are you sure you want to regenerate all seats? This will delete all existing seats and create new ones based on the current room configuration.')) {
            return;
        }

        try {
            setIsRegenerating(true);
            setError(null);
            setSuccessMessage(null);

            await SeatService.generateSeatsForRoom(roomIdNum, room.rows, room.columns, defaultSeatTypeId);

            setSuccessMessage('Seats regenerated successfully!');
            setSelectedSeat(null);

            // Refresh the component after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error('Error regenerating seats:', err);
            setError('Failed to regenerate seats.');
        } finally {
            setIsRegenerating(false);
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>Room not found or failed to load.</p>
                <button
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/admin/rooms')}
                >
                    Return to Rooms List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Link to={`/admin/rooms/${roomIdNum}`} className="mr-4">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold">Seat Management - {room.name}</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <label htmlFor="defaultSeatType" className="mr-2 text-sm whitespace-nowrap">Default Seat Type:</label>
                        <select
                            id="defaultSeatType"
                            value={defaultSeatTypeId}
                            onChange={(e) => setDefaultSeatTypeId(parseInt(e.target.value))}
                            className="px-2 py-1 border rounded"
                        >
                            {seatTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.seatTypes}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={regenerateSeats}
                        disabled={isRegenerating}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {isRegenerating ? 'Regenerating...' : 'Regenerate Seats'}
                    </button>
                </div>
            </div>

            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Room Configuration</h2>
                <p>
                    Room Size: {room.rows} rows × {room.columns} columns = {room.numOfSeats} seats<br />
                    {room.isPremium && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">Premium Room</span>}
                </p>
            </div>

            {error && (
                <div className="mb-4 bg-red-100 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="mb-4 bg-green-100 border-l-4 border-green-500 p-4 rounded-md">
                    <div className="flex items-center">
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SeatMap roomId={roomIdNum} editable={true} onSeatClick={handleSeatClick} />
                </div>

                <div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-medium mb-4">Seat Details</h2>

                        {selectedSeat ? (
                            <div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h3 className="text-sm text-gray-500">Seat</h3>
                                        <p className="font-medium">{selectedSeat.row}{selectedSeat.seatNumber}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm text-gray-500">Status</h3>
                                        <p>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedSeat.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {selectedSeat.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm text-gray-500">Position</h3>
                                        <p>Row {selectedSeat.yPosition}, Col {selectedSeat.xPosition}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm text-gray-500">ID</h3>
                                        <p className="text-xs">{selectedSeat.id}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => toggleSeatAvailability(selectedSeat)}
                                        className={`w-full py-2 px-4 rounded ${selectedSeat.isAvailable
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                    >
                                        {selectedSeat.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                                    </button>

                                    <div>
                                        <label htmlFor="seatTypeSelector" className="block text-sm font-medium mb-1">
                                            Change Seat Type:
                                        </label>
                                        <div className="flex space-x-2">
                                            <select
                                                id="seatTypeSelector"
                                                value={selectedSeat.seatTypeId}
                                                onChange={(e) => updateSeatType(selectedSeat, parseInt(e.target.value))}
                                                className="flex-1 px-2 py-1 border rounded"
                                            >
                                                {seatTypes.map(type => (
                                                    <option key={type.id} value={type.id}>{type.seatTypes}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Select a seat to view details and manage it.</p>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                        <h2 className="text-lg font-medium mb-4">Help</h2>
                        <ul className="text-sm space-y-2">
                            <li>• Click on a seat to view and manage its details.</li>
                            <li>• Use the "Regenerate Seats" button to recreate all seats based on the current room configuration.</li>
                            <li>• To change the room's dimensions, return to the room details page.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatManagement;