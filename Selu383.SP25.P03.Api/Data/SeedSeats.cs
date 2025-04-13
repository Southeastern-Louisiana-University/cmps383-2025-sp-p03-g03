using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedSeats
    {

        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {

                // Seed seats only if none exist
                if (!dataContext.Seats.Any())
                {
                    // This is a 10 row x 20 column IMAX theater

                    var seats = new List<Seat>();
                    //int seatId = 1;

                    // Generate seats for Room 1
                    for (int rowNum = 1; rowNum <= 10; rowNum++)
                    {
                        string rowLetter = ((char)('A' + rowNum - 1)).ToString();

                        for (int seatNum = 1; seatNum <= 20; seatNum++)
                        {
                            int seatTypeId = 1; // Default standard

                            // Middle rows (D-G) in center seats are premium
                            if (rowNum >= 4 && rowNum <= 7 && seatNum >= 6 && seatNum <= 15)
                            {
                                seatTypeId = 2; // Premium
                            }

                            // Back row has recliners
                            if (rowNum == 10)
                            {
                                seatTypeId = 3; // Recliner
                            }

                            // Accessible seats in row C positions 1-2 and 19-20
                            if (rowNum == 3 && (seatNum <= 2 || seatNum >= 19))
                            {
                                seatTypeId = 4; // Accessible
                            }

                            // Calculate positions (simple grid layout)
                            int xPos = seatNum * 40; // 40 pixels between seats horizontally
                            int yPos = rowNum * 40;  // 40 pixels between rows

                            seats.Add(new Seat
                            {

                                SeatTypeId = seatTypeId,
                                RoomsId = 5,
                                isAvailable = true,
                                Row = rowLetter,
                                SeatNumber = seatNum,
                                xPosition = xPos,
                                yPosition = yPos
                            });
                        }
                    }

                    // Generate seats for Room 14 (VIP Lounge)
                    // This is a 4-row theater with special layout (10 seats per row)
                    for (int rowNum = 1; rowNum <= 4; rowNum++)
                    {
                        string rowLetter = ((char)('A' + rowNum - 1)).ToString();

                        for (int seatNum = 1; seatNum <= 10; seatNum++)
                        {
                            // All seats in VIP lounge are VIP type
                            int seatTypeId = 5; // VIP

                            // VIP seats have more spacing
                            int xPos = seatNum * 60; // 60 pixels between seats horizontally
                            int yPos = rowNum * 80;  // 80 pixels between rows

                            seats.Add(new Seat
                            {

                                SeatTypeId = seatTypeId,
                                RoomsId = 6,
                                isAvailable = true,
                                Row = rowLetter,
                                SeatNumber = seatNum,
                                xPosition = xPos,
                                yPosition = yPos
                            });
                        }
                    }

                    // Add seats for a standard mid-size theater - Room 7
                    // This is a 12-row x 15-column standard theater
                    for (int rowNum = 1; rowNum <= 12; rowNum++)
                    {
                        string rowLetter = ((char)('A' + rowNum - 1)).ToString();

                        for (int seatNum = 1; seatNum <= 15; seatNum++)
                        {
                            int seatTypeId = 1; // Default standard

                            // Middle rows (E-H) in center seats are premium
                            if (rowNum >= 5 && rowNum <= 8 && seatNum >= 4 && seatNum <= 12)
                            {
                                seatTypeId = 2; // Premium
                            }

                            // Back two rows have recliners
                            if (rowNum >= 11)
                            {
                                seatTypeId = 3; // Recliner
                            }

                            // Accessible seats in row D positions 1-2 and 14-15
                            if (rowNum == 4 && (seatNum <= 2 || seatNum >= 14))
                            {
                                seatTypeId = 4; // Accessible
                            }

                            // Calculate positions (simple grid layout)
                            int xPos = seatNum * 40; // 40 pixels between seats horizontally
                            int yPos = rowNum * 40;  // 40 pixels between rows

                            seats.Add(new Seat
                            {

                                SeatTypeId = seatTypeId,
                                RoomsId = 7,
                                isAvailable = true,
                                Row = rowLetter,
                                SeatNumber = seatNum,
                                xPosition = xPos,
                                yPosition = yPos
                            });
                        }
                    }

                    await dataContext.Seats.AddRangeAsync(seats);
                    await dataContext.SaveChangesAsync();
                }
            }
        }
    }
}