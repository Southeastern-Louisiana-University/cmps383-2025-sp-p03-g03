import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MovieScheduleService,
    MovieService,
    MovieRoomScheduleLinkService,
    MovieScheduleDTO,
    Movie,
    MovieRoomScheduleLinkDTO
} from '../../../Services/MovieScheduleService';
import { TheaterDTO, TheaterService } from '../../../Services/TheaterService';
import { RoomService, RoomDTO } from '../../../Services/RoomService';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import "../../../index.css";

// Define a compatible room type that works with both Room and RoomDTO
interface CommonRoom {
    id: number;
    name: string;
    numOfSeats: number;
    isActive: boolean;
    theaterId: number;
}

interface TheaterRoomAssignment {
    theaterId: number;
    theaterName: string;
    roomId: number;
    roomName: string;
    linkId?: number;  // Will be populated for existing links
}

const MovieScheduleAssignments: React.FC = () => {
    const { id: scheduleIdParam } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const scheduleId = parseInt(scheduleIdParam || '0');

    // Data states
    const [schedule, setSchedule] = useState<MovieScheduleDTO | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [theaters, setTheaters] = useState<TheaterDTO[]>([]);
    const [rooms, setRooms] = useState<{ [theaterId: number]: CommonRoom[] }>({});
    const [assignments, setAssignments] = useState<TheaterRoomAssignment[]>([]);

    // UI states
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    //const [debugInfo, setDebugInfo] = useState<string>('');

    // For new assignment form
    const [newAssignment, setNewAssignment] = useState<{
        theaterId: number;
        roomId: number;
    }>({
        theaterId: 0,
        roomId: 0
    });

    // Helper function to convert RoomDTO to CommonRoom
    const convertToCommonRoom = (roomData: RoomDTO[]): CommonRoom[] => {
        return roomData.map(room => ({
            id: room.id || 0,
            name: room.name || 'Unknown Room',
            numOfSeats: room.numOfSeats || 0,
            isActive: room.isActive === undefined ? true : room.isActive,
            theaterId: room.theaterId || 0
        }));
    };

    // Load schedule data and theaters
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                //let debug = '';

                // Get schedule details
                try {
                    const scheduleData = await MovieScheduleService.getById(scheduleId);
                    setSchedule(scheduleData);
                    //debug += `Schedule loaded: ID=${scheduleData.id}\n`;
                } catch (scheduleError) {
                    console.error('Error loading schedule:', scheduleError);
                    setError('Failed to load movie schedule data.');
                    return;
                }

                // Get movie details
                try {
                    const moviesData = await MovieService.getAll();
                    const currentMovie = moviesData.find(m => m.id === schedule?.movieId);
                    if (currentMovie) {
                        setMovie(currentMovie);
                        //debug += `Movie found: ${currentMovie.title}\n`;
                    } else {
                        //debug += `Movie not found for ID=${schedule?.movieId}\n`;
                    }
                } catch (movieError) {
                    console.error('Error loading movies:', movieError);
                    // Non-critical error, continue loading
                    //debug += `Error loading movies: ${movieError}\n`;
                }

                // Get active theaters
                let theatersData: TheaterDTO[] = [];
                try {
                    theatersData = await TheaterService.getAll();

                    if (Array.isArray(theatersData)) {
                        setTheaters(theatersData);
                        //debug += `Theaters loaded: ${theatersData.length} theaters\n`;
                    } else {
                        console.error("Theaters data is not an array:", theatersData);
                        setTheaters([]);
                        //debug += `Theaters data is not an array\n`;
                    }
                } catch (theaterError) {
                    console.error('Error loading theaters:', theaterError);
                    setTheaters([]);
                    //debug += `Error loading theaters: ${theaterError}\n`;
                }

                // Get existing assignments - improved error handling here
                try {
                    const links = await MovieRoomScheduleLinkService.getByScheduleId(scheduleId);
                    //debug += `Links loaded: ${Array.isArray(links) ? links.length : 'not an array'} links\n`;

                    if (Array.isArray(links) && links.length > 0) {
                        const currentAssignments: TheaterRoomAssignment[] = [];
                        const roomCache: { [theaterId: number]: CommonRoom[] } = {};

                        // Pre-load all theaters' rooms to avoid multiple API calls
                        for (const link of links) {
                            if (!roomCache[link.theaterId]) {
                                try {
                                    const theaterRooms = await RoomService.getByTheaterId(link.theaterId);
                                    if (Array.isArray(theaterRooms)) {
                                        roomCache[link.theaterId] = convertToCommonRoom(theaterRooms);
                                        //debug += `Rooms loaded for theater ${link.theaterId}: ${theaterRooms.length} rooms\n`;
                                    } else {
                                        //debug += `Rooms data is not an array for theater ${link.theaterId}\n`;
                                        roomCache[link.theaterId] = [];
                                    }
                                } catch (roomError) {
                                    console.error(`Error loading rooms for theater ${link.theaterId}:`, roomError);
                                    //debug += `Error loading rooms for theater ${link.theaterId}: ${roomError}\n`;
                                    roomCache[link.theaterId] = [];
                                }
                            }
                        }

                        // Now process the links with the preloaded data
                        for (const link of links) {
                            const theater = theatersData.find(t => t.id === link.theaterId);
                            const room = roomCache[link.theaterId]?.find(r => r.id === link.roomId);

                            if (theater && room) {
                                currentAssignments.push({
                                    theaterId: theater.id,
                                    theaterName: theater.name,
                                    roomId: room.id,
                                    roomName: room.name,
                                    linkId: link.id
                                });
                                //debug += `Assignment found: ${theater.name} - ${room.name}\n`;
                            } else {
                                //debug += `Missing data for assignment: Theater=${theater ? 'found' : 'missing'}, Room=${room ? 'found' : 'missing'}\n`;
                            }
                        }

                        setRooms(roomCache);
                        setAssignments(currentAssignments);
                        //debug += `Total assignments processed: ${currentAssignments.length}\n`;
                    } else {
                        //debug += `No links found or links is not an array\n`;
                        setAssignments([]);
                    }
                } catch (linkError) {
                    console.error('Error loading assignments:', linkError);
                    setError('Failed to load assignment data.');
                    //debug += `Error loading assignments: ${linkError}\n`;
                    setAssignments([]);
                }

                //setDebugInfo(debug);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load movie schedule data.');
            } finally {
                setIsLoading(false);
            }
        };

        if (scheduleId > 0) {
            loadData();
        } else {
            setError('Invalid schedule ID.');
            setIsLoading(false);
        }
    }, [scheduleId, schedule?.movieId]);

    // Handle theater selection change and load rooms for selected theater
    const handleTheaterChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const theaterId = parseInt(e.target.value);

        // Reset room selection
        setNewAssignment({
            theaterId,
            roomId: 0
        });

        // If valid theater is selected, fetch its rooms
        if (theaterId > 0) {
            try {
                setIsLoadingRooms(true);
                setError(null);

                // Check if we already have rooms for this theater
                if (!rooms[theaterId] || rooms[theaterId].length === 0) {
                    const theaterRooms = await RoomService.getByTheaterId(theaterId);

                    // Update rooms state with new data
                    if (Array.isArray(theaterRooms)) {
                        const commonRooms = convertToCommonRoom(theaterRooms);
                        setRooms(prevRooms => ({
                            ...prevRooms,
                            [theaterId]: commonRooms
                        }));
                    } else {
                        // Handle case when theaterRooms is not an array
                        setRooms(prevRooms => ({
                            ...prevRooms,
                            [theaterId]: []
                        }));
                    }
                }
            } catch (err) {
                console.error(`Error loading rooms for theater ${theaterId}:`, err);
                setError(`Failed to load rooms for the selected theater.`);
                // Initialize with empty array in case of error
                setRooms(prevRooms => ({
                    ...prevRooms,
                    [theaterId]: []
                }));
            } finally {
                setIsLoadingRooms(false);
            }
        }
    };

    // Handle room selection change
    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewAssignment({
            ...newAssignment,
            roomId: parseInt(e.target.value)
        });
    };

    // Add new assignment
    const handleAddAssignment = async () => {
        if (newAssignment.theaterId === 0 || newAssignment.roomId === 0 || !schedule) {
            setError('Please select both a theater and a room.');
            return;
        }

        // Check if this theater/room combination already exists
        const duplicateAssignment = assignments.find(
            a => a.theaterId === newAssignment.theaterId && a.roomId === newAssignment.roomId
        );

        if (duplicateAssignment) {
            setError('This theater and room combination is already assigned to this schedule.');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            // Create the link
            const newLink: Omit<MovieRoomScheduleLinkDTO, 'id'> = {
                theaterId: newAssignment.theaterId,
                roomId: newAssignment.roomId,
                movieId: schedule.movieId,
                movieScheduleId: scheduleId
            };

            const result = await MovieRoomScheduleLinkService.create(newLink);

            // Find the theater and room names
            const theater = theaters.find(t => t.id === newAssignment.theaterId);
            const room = rooms[newAssignment.theaterId]?.find(r => r.id === newAssignment.roomId);

            if (theater && room) {
                // Add the new assignment to the list
                setAssignments([
                    ...assignments,
                    {
                        theaterId: newAssignment.theaterId,
                        theaterName: theater.name,
                        roomId: newAssignment.roomId,
                        roomName: room.name,
                        linkId: result.id
                    }
                ]);

                // Reset the form
                setNewAssignment({
                    theaterId: 0,
                    roomId: 0
                });

                setSuccessMessage('Theater and room assigned successfully!');

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
            }
        } catch (err) {
            console.error('Error adding assignment:', err);
            setError('Failed to assign theater and room.');
        } finally {
            setIsSaving(false);
        }
    };

    // Remove assignment
    const handleRemoveAssignment = async (assignment: TheaterRoomAssignment) => {
        if (!assignment.linkId) return;

        try {
            setIsSaving(true);
            setError(null);

            // Delete the link
            await MovieRoomScheduleLinkService.delete(assignment.linkId);

            // Remove from the assignments list
            setAssignments(assignments.filter(a => !(a.theaterId === assignment.theaterId && a.roomId === assignment.roomId)));

            setSuccessMessage('Assignment removed successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (err) {
            console.error('Error removing assignment:', err);
            setError('Failed to remove theater and room assignment.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error && !schedule) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>{error}</p>
                <button
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/admin/movieschedules')}
                >
                    Return to Movie Schedules List
                </button>
            </div>
        );
    }

    // Safely get the rooms array for the selected theater
    const selectedTheaterRooms = newAssignment.theaterId > 0
        ? (rooms[newAssignment.theaterId] || [])
        : [];

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manage Theater & Room Assignments</h1>
                    {movie && (
                        <p className="text-gray-600 mt-1">
                            {movie.title}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => navigate(`/admin/movieschedules/${scheduleId}`)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Back to Schedule
                </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {/* Add New Assignment Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-medium mb-4">Add New Assignment</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="theaterId" className="block text-sm font-medium mb-1">
                            Theater
                        </label>
                        <select
                            id="theaterId"
                            value={newAssignment.theaterId}
                            onChange={handleTheaterChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            disabled={isSaving || theaters.length === 0}
                        >
                            {theaters.length === 0 ? (
                                <option value="0">No theaters available</option>
                            ) : (
                                <>
                                    <option value="0">Select a theater</option>
                                    {theaters.map(theater => (
                                        <option key={theater.id} value={theater.id}>
                                            {theater.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="roomId" className="block text-sm font-medium mb-1">
                            Room
                        </label>
                        <select
                            id="roomId"
                            value={newAssignment.roomId}
                            onChange={handleRoomChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            disabled={newAssignment.theaterId === 0 || isSaving || isLoadingRooms}
                        >
                            {isLoadingRooms ? (
                                <option value="0">Loading rooms...</option>
                            ) : selectedTheaterRooms.length === 0 ? (
                                <option value="0">No rooms available</option>
                            ) : (
                                <>
                                    <option value="0">Select a room</option>
                                    {selectedTheaterRooms.map(room => (
                                        <option key={room.id} value={room.id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={handleAddAssignment}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full justify-center"
                            disabled={newAssignment.theaterId === 0 || newAssignment.roomId === 0 || isSaving || isLoadingRooms}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Assign
                        </button>
                    </div>
                </div>
            </div>

            {/* Current Assignments Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Current Assignments</h2>

                {assignments.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">
                        No theaters or rooms have been assigned to this movie schedule yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Theater
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {assignments.map((assignment, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {assignment.theaterName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {assignment.roomName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleRemoveAssignment(assignment)}
                                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                disabled={isSaving}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6 space-x-4">
                <button
                    onClick={() => navigate('/admin/movieschedules')}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                    Back to Schedules
                </button>
                <button
                    onClick={() => navigate(`/admin/movieschedules/${scheduleId}`)}
                    className="px-4 py-2 bg-summit text-white rounded"
                >
                    Back to Schedule Details
                </button>
            </div>
        </div>
    );
};

export default MovieScheduleAssignments;