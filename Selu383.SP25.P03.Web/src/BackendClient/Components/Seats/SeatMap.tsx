import React, { useState, useEffect } from 'react';
import { SeatDTO, SeatTypeDTO, SeatService, SeatTypeService } from '../../../Services/SeatService';

interface SeatMapProps {
    roomId: number;
    editable?: boolean;
    onSeatClick?: (seat: SeatDTO) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ roomId, editable = false, onSeatClick }) => {
    const [seats, setSeats] = useState<SeatDTO[]>([]);
    const [seatTypes, setSeatTypes] = useState<SeatTypeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [maxRows, setMaxRows] = useState(0);
    const [maxCols, setMaxCols] = useState(0);
    const [seatsByPosition, setSeatsByPosition] = useState<Record<string, SeatDTO>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch both seats and seat types
                const [seatsData, seatTypesData] = await Promise.all([
                    SeatService.getByRoomId(roomId),
                    SeatTypeService.getAll()
                ]);

                // Sort seats by position for consistency
                seatsData.sort((a, b) => {
                    // First sort by row alphabetically
                    const rowCompare = a.row.localeCompare(b.row);
                    if (rowCompare !== 0) return rowCompare;

                    // Then sort by seat number
                    return a.seatNumber - b.seatNumber;
                });

                setSeats(seatsData);
                setSeatTypes(seatTypesData);

                // Calculate max rows and columns
                let maxRowNum = 0;
                let maxColNum = 0;

                const positionMap: Record<string, SeatDTO> = {};

                seatsData.forEach(seat => {
                    maxRowNum = Math.max(maxRowNum, seat.yPosition);
                    maxColNum = Math.max(maxColNum, seat.xPosition);

                    // Create a unique key for each position
                    const posKey = `${seat.yPosition}-${seat.xPosition}`;
                    positionMap[posKey] = seat;
                });

                setMaxRows(maxRowNum);
                setMaxCols(maxColNum);
                setSeatsByPosition(positionMap);

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load seats and seat types for this room.');
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchData();
        }
    }, [roomId]);

    const handleSeatClick = (seat: SeatDTO) => {
        if (editable && onSeatClick) {
            onSeatClick(seat);
        }
    };

    // Get seat at a specific row and column position
    const getSeatAtPosition = (row: number, col: number): SeatDTO | null => {
        const posKey = `${row}-${col}`;
        return seatsByPosition[posKey] || null;
    };

    // Get seat type name from ID
    const getSeatTypeName = (seatTypeId: number): string => {
        const seatType = seatTypes.find(type => type.id === seatTypeId);
        return seatType ? seatType.seatTypes : 'Standard';
    };

    // Generate a color based on the seat's properties and type
    const getSeatColor = (seat: SeatDTO | null): string => {
        if (!seat) return 'bg-gray-200'; // Empty space

        if (!seat.isAvailable) return 'bg-red-300'; // Unavailable seat

        // Different colors based on seat type
        const seatTypeName = getSeatTypeName(seat.seatTypeId).toLowerCase();

        if (seatTypeName.includes('premium') || seatTypeName.includes('vip')) {
            return 'bg-purple-500 hover:bg-purple-600';
        } else if (seatTypeName.includes('accessible') || seatTypeName.includes('handicap')) {
            return 'bg-blue-500 hover:bg-blue-600';
        } else if (seatTypeName.includes('recline') || seatTypeName.includes('luxury')) {
            return 'bg-amber-500 hover:bg-amber-600';
        }

        // Default available seat
        return 'bg-emerald-500 hover:bg-emerald-600';
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
        </div>;
    }

    if (seats.length === 0) {
        return <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No seats found for this room. Please create some seats first.
        </div>;
    }

    return (
        <div className="overflow-auto">
            <h3 className="text-lg font-medium mb-4">Seat Map</h3>

            <div className="relative border border-gray-300 rounded p-4 overflow-auto">
                {/* Screen indicator */}
                <div className="w-3/4 h-6 mx-auto mb-8 bg-gray-300 flex justify-center items-center text-sm text-gray-700 rounded-lg">
                    SCREEN
                </div>

                {/* Seat grid */}
                <div className="flex flex-col items-center">
                    {Array.from({ length: maxRows }).map((_, rowIndex) => (
                        <div key={`row-${rowIndex + 1}`} className="flex mb-2 items-center">
                            {/* Row label */}
                            <div className="w-8 text-center font-medium text-gray-700 mr-2">
                                {seats.find(s => s.yPosition === rowIndex + 1)?.row || ''}
                            </div>

                            {/* Seats in this row */}
                            <div className="flex">
                                {Array.from({ length: maxCols }).map((_, colIndex) => {
                                    const seat = getSeatAtPosition(rowIndex + 1, colIndex + 1);
                                    const seatColor = getSeatColor(seat);

                                    return (
                                        <div
                                            key={`seat-${rowIndex + 1}-${colIndex + 1}`}
                                            className={`w-8 h-8 mx-1 rounded flex items-center justify-center text-xs text-white cursor-pointer ${seatColor} ${editable ? 'cursor-pointer' : 'cursor-default'}`}
                                            onClick={() => seat && handleSeatClick(seat)}
                                            title={seat ? `${seat.row}${seat.seatNumber}` : 'No seat'}
                                        >
                                            {seat ? seat.seatNumber : ''}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-emerald-500 mr-2"></div>
                        <span className="text-sm">Standard</span>
                    </div>

                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-purple-500 mr-2"></div>
                        <span className="text-sm">Premium/VIP</span>
                    </div>

                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
                        <span className="text-sm">Accessible</span>
                    </div>

                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-amber-500 mr-2"></div>
                        <span className="text-sm">Recliner/Luxury</span>
                    </div>

                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-red-300 mr-2"></div>
                        <span className="text-sm">Unavailable</span>
                    </div>

                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-gray-200 mr-2"></div>
                        <span className="text-sm">Empty Space</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;