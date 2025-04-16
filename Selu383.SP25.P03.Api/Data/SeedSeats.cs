using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Rooms;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedSeats
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());
            try
            {
                Console.WriteLine("Starting seat seeding...");

                // Clear existing data
                dataContext.RoomSeats.RemoveRange(dataContext.RoomSeats);
                dataContext.Seats.RemoveRange(dataContext.Seats);
                await dataContext.SaveChangesAsync();
                Console.WriteLine("Cleared existing Seats and RoomSeats tables.");

                // Verify rooms exist
                var room1 = await dataContext.Rooms.FirstOrDefaultAsync(r => r.Id == 59);
                var room2 = await dataContext.Rooms.FirstOrDefaultAsync(r => r.Id == 60);
                var room3 = await dataContext.Rooms.FirstOrDefaultAsync(r => r.Id == 61);
                var room4 = await dataContext.Rooms.FirstOrDefaultAsync(r => r.Id == 62);

                if (room1 == null || room2 == null || room3 == null || room4 == null)
                {
                    throw new Exception("One or more rooms not found. Ensure SeedRooms.cs has run.");
                }

                // Verify seat types
                var standardSeatType = await dataContext.SeatTypes.FirstOrDefaultAsync(st => st.Id == 1);
                var accessibleSeatType = await dataContext.SeatTypes.FirstOrDefaultAsync(st => st.Id == 4);
                if (standardSeatType == null || accessibleSeatType == null)
                {
                    throw new Exception("Standard or Accessible seat type not found. Ensure SeedSeatTypes.cs has run.");
                }

                var seats = new List<Seat>();
                var roomSeats = new List<RoomSeats>();

                // Room 1: 10 rows (A-J) x 20 seats
                for (int rowNum = 1; rowNum <= 10; rowNum++)
                {
                    string rowLetter = ((char)('A' + rowNum - 1)).ToString();
                    for (int seatNum = 1; seatNum <= 20; seatNum++)
                    {
                        int seatTypeId = 1; // Standard
                        if (rowNum == 3 && (seatNum <= 2 || seatNum >= 19))
                            seatTypeId = 4; // Accessible

                        int xPos = seatNum * 40 - (20 * 40 / 2); // Center-aligned
                        int yPos = rowNum * 50 + 50;

                        var seat = new Seat
                        {
                            SeatTypeId = seatTypeId,
                            RoomsId = 59,
                            isAvailable = true,
                            Row = rowLetter,
                            SeatNumber = seatNum,
                            xPosition = xPos,
                            yPosition = yPos
                        };
                        seats.Add(seat);
                    }
                }

                // Room 2: 10 rows (A-J) x 15 seats
                for (int rowNum = 1; rowNum <= 10; rowNum++)
                {
                    string rowLetter = ((char)('A' + rowNum - 1)).ToString();
                    for (int seatNum = 1; seatNum <= 15; seatNum++)
                    {
                        int seatTypeId = 1; // Standard
                        if (rowNum == 3 && (seatNum <= 2 || seatNum >= 14))
                            seatTypeId = 4; // Accessible

                        int xPos = seatNum * 40 - (15 * 40 / 2);
                        int yPos = rowNum * 50 + 50;

                        seats.Add(new Seat
                        {
                            SeatTypeId = seatTypeId,
                            RoomsId = 60,
                            isAvailable = true,
                            Row = rowLetter,
                            SeatNumber = seatNum,
                            xPosition = xPos,
                            yPosition = yPos
                        });
                    }
                }

                // Room 3: 8 rows (A-H) x 10 seats
                for (int rowNum = 1; rowNum <= 8; rowNum++)
                {
                    string rowLetter = ((char)('A' + rowNum - 1)).ToString();
                    for (int seatNum = 1; seatNum <= 10; seatNum++)
                    {
                        int seatTypeId = 1; // Standard
                        if (rowNum == 2 && (seatNum <= 2 || seatNum >= 9))
                            seatTypeId = 4; // Accessible

                        int xPos = seatNum * 40 - (10 * 40 / 2);
                        int yPos = rowNum * 50 + 50;

                        seats.Add(new Seat
                        {
                            SeatTypeId = seatTypeId,
                            RoomsId = 61,
                            isAvailable = true,
                            Row = rowLetter,
                            SeatNumber = seatNum,
                            xPosition = xPos,
                            yPosition = yPos
                        });
                    }
                }

                // Room 4: 6 rows (A-F) x 10 seats
                for (int rowNum = 1; rowNum <= 6; rowNum++)
                {
                    string rowLetter = ((char)('A' + rowNum - 1)).ToString();
                    for (int seatNum = 1; seatNum <= 10; seatNum++)
                    {
                        int seatTypeId = 1; // Standard
                        if (rowNum == 2 && (seatNum <= 2 || seatNum >= 9))
                            seatTypeId = 4; // Accessible

                        int xPos = seatNum * 40 - (10 * 40 / 2);
                        int yPos = rowNum * 50 + 50;

                        seats.Add(new Seat
                        {
                            SeatTypeId = seatTypeId,
                            RoomsId = 62,
                            isAvailable = true,
                            Row = rowLetter,
                            SeatNumber = seatNum,
                            xPosition = xPos,
                            yPosition = yPos
                        });
                    }
                }

                // Add seats to database
                await dataContext.Seats.AddRangeAsync(seats);
                await dataContext.SaveChangesAsync();
                Console.WriteLine($"Seeded {seats.Count(s => s.RoomsId == 59)} seats for Room 1 (Standard: {seats.Count(s => s.RoomsId == 59 && s.SeatTypeId == 1)}, Accessible: {seats.Count(s => s.RoomsId == 59 && s.SeatTypeId == 4)})");
                Console.WriteLine($"Seeded {seats.Count(s => s.RoomsId == 60)} seats for Room 2 (Standard: {seats.Count(s => s.RoomsId == 60 && s.SeatTypeId == 1)}, Accessible: {seats.Count(s => s.RoomsId == 60 && s.SeatTypeId == 4)})");
                Console.WriteLine($"Seeded {seats.Count(s => s.RoomsId == 61)} seats for Room 3 (Standard: {seats.Count(s => s.RoomsId == 61 && s.SeatTypeId == 1)}, Accessible: {seats.Count(s => s.RoomsId == 61 && s.SeatTypeId == 4)})");
                Console.WriteLine($"Seeded {seats.Count(s => s.RoomsId == 62)} seats for Room 4 (Standard: {seats.Count(s => s.RoomsId == 62 && s.SeatTypeId == 1)}, Accessible: {seats.Count(s => s.RoomsId == 62 && s.SeatTypeId == 4)})");

                // Seed RoomSeats relationships
                var room1Seats = seats.Where(s => s.RoomsId == 59).ToList();
                roomSeats.AddRange(room1Seats.Select(s => new RoomSeats
                {
                    RoomId = 59,
                    SeatId = s.Id
                }));

                var room2Seats = seats.Where(s => s.RoomsId == 60).ToList();
                roomSeats.AddRange(room2Seats.Select(s => new RoomSeats
                {
                    RoomId = 60,
                    SeatId = s.Id
                }));

                var room3Seats = seats.Where(s => s.RoomsId == 61).ToList();
                roomSeats.AddRange(room3Seats.Select(s => new RoomSeats
                {
                    RoomId = 61,
                    SeatId = s.Id
                }));

                var room4Seats = seats.Where(s => s.RoomsId == 62).ToList();
                roomSeats.AddRange(room4Seats.Select(s => new RoomSeats
                {
                    RoomId = 62,
                    SeatId = s.Id
                }));

                await dataContext.RoomSeats.AddRangeAsync(roomSeats);
                await dataContext.SaveChangesAsync();
                Console.WriteLine($"Seeded {roomSeats.Count(rs => rs.RoomId == 59)} RoomSeats for Room 1");
                Console.WriteLine($"Seeded {roomSeats.Count(rs => rs.RoomId == 60)} RoomSeats for Room 2");
                Console.WriteLine($"Seeded {roomSeats.Count(rs => rs.RoomId == 61)} RoomSeats for Room 3");
                Console.WriteLine($"Seeded {roomSeats.Count(rs => rs.RoomId == 62)} RoomSeats for Room 4");

                Console.WriteLine("Seat seeding completed successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Seeding failed: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }
    }
}