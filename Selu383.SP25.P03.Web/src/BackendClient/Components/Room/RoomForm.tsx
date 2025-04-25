
import React, { useState, useEffect } from 'react';
import { RoomService, RoomDTO } from '../../../Services/RoomService';
import { TheaterService, TheaterDTO } from '../../../Services/TheaterService';
import { SeatService, SeatTypeService, SeatTypeDTO } from '../../../Services/SeatService';
import { useParams, useNavigate, Link } from 'react-router-dom';
import "../BackendCSS/Backend.css";
import axios from 'axios';

const RoomFormPage: React.FC = () => {
    const { id: roomId, theaterId } = useParams<{ id: string, theaterId: string }>();
    const navigate = useNavigate();

    const isNewRoom = roomId === 'new' || !roomId;
    const roomIdNum = isNewRoom ? 0 : parseInt(roomId || '0');
    const theaterIdNum = theaterId ? parseInt(theaterId) : 0;

    const pageTitle = isNewRoom ? 'Create New Room' : 'Room Details';

    const [room, setRoom] = useState<RoomDTO>({
        id: 0,
        numOfSeats: 0,
        rows: 0,
        columns: 0,
        isActive: true,
        isPremium: false,
        timeToClean: 30,
        theaterId: theaterIdNum
    });

    const [theater, setTheater] = useState<TheaterDTO | null>(null);
    const [theaters, setTheaters] = useState<TheaterDTO[]>([]);
    const [seatTypes, setSeatTypes] = useState<SeatTypeDTO[]>([]);
    const [defaultSeatTypeId, setDefaultSeatTypeId] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingSeats, setIsGeneratingSeats] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(isNewRoom);
    const [originalRows, setOriginalRows] = useState(0);
    const [originalColumns, setOriginalColumns] = useState(0);

    // Helper function to calculate number of seats
    const calculateNumOfSeats = (rows: number, columns: number) => {
        return rows * columns;
    };

    // Load data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load seat types
                try {
                    const seatTypesData = await SeatTypeService.getAll();
                    setSeatTypes(seatTypesData);
                    if (seatTypesData.length > 0) {
                        setDefaultSeatTypeId(seatTypesData[0].id);
                    }
                } catch (err) {
                    console.error('Error loading seat types:', err);
                    // Don't fail completely if seat types can't be loaded
                }

                // If a theater ID was provided, load that theater's details
                if (theaterIdNum) {
                    try {
                        const theaterData = await TheaterService.getById(theaterIdNum);
                        setTheater(theaterData);

                        // Update room's theater ID
                        setRoom(prev => ({ ...prev, theaterId: theaterIdNum }));
                    } catch (err) {
                        console.error('Error loading theater data:', err);
                        // Don't fail completely if theater data can't be loaded
                    }
                } else {
                    // If no theater ID, load all theaters for selection
                    try {
                        const theatersData = await TheaterService.getAll();
                        setTheaters(theatersData);
                    } catch (err) {
                        console.error('Error loading theaters:', err);
                        setTheaters([]);
                    }
                }

                // If editing an existing room, load room data
                if (!isNewRoom) {
                    const roomData = await RoomService.getById(roomIdNum);
                    setRoom(roomData);
                    setOriginalRows(roomData.rows);
                    setOriginalColumns(roomData.columns);

                    // If room has a theater ID and we don't already have theater data
                    if (roomData.theaterId && !theaterIdNum) {
                        try {
                            const theaterData = await TheaterService.getById(roomData.theaterId);
                            setTheater(theaterData);
                        } catch (err) {
                            console.error('Error loading room\'s theater:', err);
                        }
                    }
                }
            } catch (err) {
                setError(isNewRoom ? 'Failed to load required data.' : 'Failed to load room data.');
                console.error('Error loading data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [roomIdNum, theaterIdNum, isNewRoom]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setRoom(prev => ({ ...prev, [name]: checked }));
            return;
        }

        // For select inputs that should be numbers
        if (name === 'theaterId') {
            setRoom(prev => ({ ...prev, [name]: parseInt(value) }));
            return;
        }

        // Handle rows and columns to update numOfSeats
        if (name === 'rows' || name === 'columns') {
            const numValue = parseInt(value);
            if (!isNaN(numValue)) {
                const rows = name === 'rows' ? numValue : room.rows;
                const columns = name === 'columns' ? numValue : room.columns;
                const numOfSeats = calculateNumOfSeats(rows, columns);

                setRoom(prev => ({
                    ...prev,
                    [name]: numValue,
                    numOfSeats: numOfSeats
                }));
            } else {
                setRoom(prev => ({ ...prev, [name]: value }));
            }
            return;
        }

        // For numeric inputs
        if (type === 'number') {
            const numValue = parseInt(value);
            setRoom(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
            return;
        }

        // For all other inputs
        setRoom(prev => ({ ...prev, [name]: value }));
    };

    // Generate seats for a room
    const generateSeats = async (roomId: number, rows: number, columns: number): Promise<boolean> => {
        try {
            setIsGeneratingSeats(true);
            await SeatService.generateSeatsForRoom(roomId, rows, columns, defaultSeatTypeId);
            return true;
        } catch (error) {
            console.error('Error generating seats:', error);
            return false;
        } finally {
            setIsGeneratingSeats(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Validate form data
            if (!room.name || room.rows <= 0 || room.columns <= 0 || room.theaterId === 0) {
                setError('Please fill in all required fields.');
                setIsSaving(false);
                return;
            }

            // Create a properly formatted room object for API
            const roomToSubmit: RoomDTO = {
                id: room.id, // Always include id (will be 0 for new rooms)
                name: room.name || "",
                numOfSeats: room.numOfSeats,
                rows: room.rows,
                columns: room.columns,
                screenType: room.screenType || "",
                audio: room.audio || "",
                isActive: room.isActive,
                isPremium: room.isPremium,
                timeToClean: room.timeToClean,
                theaterId: room.theaterId
            };

            // Log for debugging
            console.log('Submitting room data:', roomToSubmit);

            let result;
            let shouldGenerateSeats = false;

            if (isNewRoom) {
                // Create new room
                result = await RoomService.create(roomToSubmit);
                shouldGenerateSeats = true;
                setSuccessMessage('Room created successfully!');
            } else {
                // Update existing room
                result = await RoomService.update(roomIdNum, roomToSubmit);
                // Only generate seats if rows or columns have changed
                shouldGenerateSeats = (room.rows !== originalRows || room.columns !== originalColumns);
                setSuccessMessage('Room updated successfully!');
                setIsEditMode(false);
            }

            // If we've created a new room, update our state with the returned data
            if (result) {
                const updatedRoom = result;
                setRoom(updatedRoom);

                // Generate seats if needed
                if (shouldGenerateSeats) {
                    setSuccessMessage(prev => prev + ' Generating seats...');
                    const seatsGenerated = await generateSeats(updatedRoom.id, updatedRoom.rows, updatedRoom.columns);
                    if (seatsGenerated) {
                        setSuccessMessage(prev => prev + ' Seats generated successfully!');
                    } else {
                        setSuccessMessage(prev => prev + ' Failed to generate seats. Please check the room configuration.');
                    }
                }
            }

            // Redirect back to appropriate list after a delay
            setTimeout(() => {
                if (theaterIdNum) {
                    navigate(`/admin/theaters/${theaterIdNum}/rooms`);
                } else {
                    navigate('/admin/rooms');
                }
            }, 2000);

        } catch (error: unknown) {
            // Enhanced error handling with proper typing
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('API Error Response:', error.response.data);
                    setError(`Failed to ${isNewRoom ? 'create' : 'update'} room. Server returned: ${error.response.status} ${error.response.statusText}`);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    setError(`Failed to ${isNewRoom ? 'create' : 'update'} room. No response received from server.`);
                } else {
                    console.error('Error setting up request:', error.message);
                    setError(`Failed to ${isNewRoom ? 'create' : 'update'} room. Error setting up request.`);
                }
            } else {
                setError(isNewRoom ? 'Failed to create room.' : 'Failed to update room.');
                console.error('Error saving room:', error);
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error && !isNewRoom && !room.id) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>{error}</p>
                <button
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={() =>
                        theaterIdNum ?
                            navigate(`/admin/theaters/${theaterIdNum}/rooms`) :
                            navigate('/admin/rooms')
                    }
                >
                    Return to Rooms List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {isNewRoom ? pageTitle : isEditMode ? 'Update Room' : pageTitle}
                </h1>
                <div>
                    {!isNewRoom && !isEditMode && (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded"
                        >
                            Edit Room
                        </button>
                    )}
                    {!isNewRoom && isEditMode && (
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

            {theater && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-lg font-medium">Theater: {theater.name}</h2>
                    <p className="text-gray-600">
                        {theater.city}{theater.city && theater.state ? ', ' : ''}{theater.state}
                    </p>
                    {theaterIdNum && (
                        <Link
                            to={`/admin/theaters/${theaterIdNum}/rooms`}
                            className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-2"
                        >
                            Back to Theater Rooms
                        </Link>
                    )}
                </div>
            )}

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

            {(isEditMode || isNewRoom) ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={room.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="isActive" className="ml-2">Active</label>
                    </div>

                    {/* Room Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                            Room Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={room.name || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    {/* Theater Selection - only if no theater ID was provided */}
                    {!theaterIdNum && (
                        <div>
                            <label htmlFor="theaterId" className="block text-sm font-medium">
                                Theater <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="theaterId"
                                name="theaterId"
                                value={room.theaterId || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            >
                                <option value="">Select a theater</option>
                                {theaters.map(theater => (
                                    <option key={theater.id} value={theater.id}>{theater.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Layout & Capacity */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Layout & Capacity</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="rows" className="block text-sm font-medium">
                                    Rows <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="rows"
                                    name="rows"
                                    value={room.rows}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    min="1"
                                    required
                                />
                                {!isNewRoom && originalRows !== room.rows && (
                                    <p className="text-xs text-amber-600 mt-1">
                                        Changing this will regenerate all seats
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="columns" className="block text-sm font-medium">
                                    Columns <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="columns"
                                    name="columns"
                                    value={room.columns}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    min="1"
                                    required
                                />
                                {!isNewRoom && originalColumns !== room.columns && (
                                    <p className="text-xs text-amber-600 mt-1">
                                        Changing this will regenerate all seats
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="numOfSeats" className="block text-sm font-medium">
                                    Total Seats
                                </label>
                                <input
                                    type="number"
                                    id="numOfSeats"
                                    name="numOfSeats"
                                    value={room.numOfSeats}
                                    readOnly
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                                />
                                <p className="text-xs text-gray-500 mt-1">Calculated from rows and columns</p>
                            </div>
                        </div>
                    </div>

                    {/* Theater Experience */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Theater Experience</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="screenType" className="block text-sm font-medium">
                                    Screen Type
                                </label>
                                <input
                                    type="text"
                                    id="screenType"
                                    name="screenType"
                                    value={room.screenType || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    placeholder="e.g., Standard, IMAX, 3D"
                                />
                            </div>

                            <div>
                                <label htmlFor="audio" className="block text-sm font-medium">
                                    Audio System
                                </label>
                                <input
                                    type="text"
                                    id="audio"
                                    name="audio"
                                    value={room.audio || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    placeholder="e.g., Dolby Atmos, DTS, Surround Sound"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isPremium"
                                name="isPremium"
                                checked={room.isPremium}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="isPremium" className="ml-2">Premium Room (higher pricing tier)</label>
                        </div>
                    </div>

                    {/* Operations */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Operations</h2>

                        <div>
                            <label htmlFor="timeToClean" className="block text-sm font-medium">
                                Cleaning Time (minutes)
                            </label>
                            <input
                                type="number"
                                id="timeToClean"
                                name="timeToClean"
                                value={room.timeToClean}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                min="0"
                            />
                            <p className="text-xs text-gray-500 mt-1">Time needed to clean the room between showings</p>
                        </div>
                    </div>

                    {/* Seat Generation Note */}
                    {!isNewRoom && (originalRows !== room.rows || originalColumns !== room.columns) && (
                        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-md font-medium text-blue-800 mb-2">Seat Configuration Change</h3>
                            <p className="text-sm">
                                You've changed the room dimensions from {originalRows}x{originalColumns} to {room.rows}x{room.columns}.
                                When you save, all existing seats for this room will be deleted and new ones will be generated.
                            </p>
                        </div>
                    )}

                    {/* Seat Type Selection */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Seat Configuration</h2>

                        <div>
                            <label htmlFor="defaultSeatTypeId" className="block text-sm font-medium">
                                Default Seat Type
                            </label>
                            <select
                                id="defaultSeatTypeId"
                                value={defaultSeatTypeId}
                                onChange={(e) => setDefaultSeatTypeId(parseInt(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                {seatTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.seatTypes}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                This seat type will be used for all seats when they are created initially.
                                You can change individual seat types after creation.
                            </p>
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (isNewRoom) {
                                    if (theaterIdNum) {
                                        navigate(`/admin/theaters/${theaterIdNum}/rooms`);
                                    } else {
                                        navigate('/admin/rooms');
                                    }
                                } else {
                                    setIsEditMode(false);
                                }
                            }}
                            className="bg-emerald-600 text-white px-4 py-2 rounded"
                            disabled={isSaving || isGeneratingSeats}
                        >
                            {isNewRoom ? 'Cancel' : 'Back to View'}
                        </button>
                        <button
                            type="submit"
                            className="bg-summit text-white px-4 py-2 rounded"
                            disabled={isSaving || isGeneratingSeats}
                        >
                            {isSaving ? 'Saving...' :
                                isGeneratingSeats ? 'Generating Seats...' :
                                    isNewRoom ? 'Create Room' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* View mode */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className={`h-3 w-3 rounded-full mr-2 ${room.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{room.isActive ? 'Active' : 'Inactive'}</span>
                        </div>

                        <div>
                            <h3 className="text-sm text-gray-500">Room Name</h3>
                            <p className="font-medium">{room.name}</p>
                        </div>
                    </div>

                    {/* Layout & Capacity */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Layout & Capacity</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h3 className="text-sm text-gray-500">Rows</h3>
                                <p>{room.rows}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Columns</h3>
                                <p>{room.columns}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Total Seats</h3>
                                <p>{room.numOfSeats}</p>
                            </div>
                        </div>
                    </div>

                    {/* Theater Experience */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Theater Experience</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm text-gray-500">Screen Type</h3>
                                <p>{room.screenType || <span className="text-gray-400 italic">Not specified</span>}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Audio System</h3>
                                <p>{room.audio || <span className="text-gray-400 italic">Not specified</span>}</p>
                            </div>
                        </div>

                        <div className="mt-3">
                            <h3 className="text-sm text-gray-500">Premium Status</h3>
                            <p>
                                {room.isPremium ?
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Premium</span>
                                    : 'Standard Room'}
                            </p>
                        </div>
                    </div>

                    {/* Operations */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Operations</h2>

                        <div>
                            <h3 className="text-sm text-gray-500">Cleaning Time</h3>
                            <p>{room.timeToClean} minutes</p>
                        </div>
                    </div>

                    {/* Seat Management Section */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Seat Management</h2>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-700">
                                    This room has {room.numOfSeats} seats in a {room.rows}x{room.columns} configuration.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/admin/rooms/${room.id}/seats`)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Manage Seats
                            </button>
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() =>
                                theaterIdNum ?
                                    navigate(`/admin/theaters/${theaterIdNum}/rooms`) :
                                    navigate('/admin/rooms')
                            }
                            className="bg-summit text-white px-4 py-2 rounded"
                        >
                            Back to Rooms
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomFormPage;