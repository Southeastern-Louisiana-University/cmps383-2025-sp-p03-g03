using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Rooms;
using Selu383.SP25.P03.Api.Features.Theaters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedRooms
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Only seed if rooms don't exist
                if (!dataContext.Rooms.Any())
                {
                    // First, get theaters by name to obtain their IDs
                    var nolaTheater = await dataContext.Theaters
                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: New Orleans");

                    var nyTheater = await dataContext.Theaters
                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: New York");

                    var laTheater = await dataContext.Theaters
                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: Los Angeles");

                    // Make sure theaters exist before adding rooms
                    if (nolaTheater == null || nyTheater == null || laTheater == null)
                    {
                        throw new Exception("Required theaters not found. Please ensure theaters are seeded first.");
                    }

                    // Create rooms with the actual theater IDs
                    var rooms = new List<Room>
                    {
                        // New Orleans Theater
                        new Room
                        {
                            Name = "Room 1",
                            NumOfSeats = 200,
                            rows = 10,
                            columns = 20,
                            ScreenType = "IMAX",
                            Audio = "Dolby Atmos",
                            IsActive = true,
                            IsPremium = true,
                            TimeToClean = 30,
                            TheaterId = nolaTheater.Id
                        },
                        new Room
                        {
                            Name = "Room 2",
                            NumOfSeats = 150,
                            rows = 10,
                            columns = 15,
                            ScreenType = "Standard",
                            Audio = "Dolby Digital",
                            IsActive = true,
                            TimeToClean = 25,
                            TheaterId = nolaTheater.Id
                        },
                        new Room
                        {
                            Name = "Room 3",
                            NumOfSeats = 80,
                            rows = 8,
                            columns = 10,
                            ScreenType = "Standard",
                            Audio = "Dolby Digital",
                            IsActive = true,
                            TimeToClean = 20,
                            TheaterId = nolaTheater.Id
                        },
                        new Room
                        {
                            Name = "Room 4",
                            NumOfSeats = 60,
                            rows = 6,
                            columns = 10,
                            ScreenType = "Standard",
                            Audio = "Standard",
                            IsActive = true,
                            TimeToClean = 15,
                            TheaterId = nolaTheater.Id
                        },

                        // New York Theater
                        new Room
                        {
                            Name = "Auditorium A",
                            NumOfSeats = 300,
                            rows = 15,
                            columns = 20,
                            ScreenType = "IMAX",
                            Audio = "Dolby Atmos",
                            IsActive = true,
                            IsPremium = true,
                            TimeToClean = 45,
                            TheaterId = nyTheater.Id
                        },
                        new Room
                        {
                            Name = "Auditorium B",
                            NumOfSeats = 250,
                            rows = 10,
                            columns = 25,
                            ScreenType = "Premium Large Format",
                            Audio = "Dolby Atmos",
                            IsActive = true,
                            IsPremium = true,
                            TimeToClean = 40,
                            TheaterId = nyTheater.Id
                        },
                        new Room
                        {
                            Name = "Auditorium C",
                            NumOfSeats = 180,
                            rows = 12,
                            columns = 15,
                            ScreenType = "Standard",
                            Audio = "Dolby Digital",
                            IsActive = true,
                            TimeToClean = 30,
                            TheaterId = nyTheater.Id
                        },
                        new Room
                        {
                            Name = "Auditorium D",
                            NumOfSeats = 180,
                            rows = 12,
                            columns = 15,
                            ScreenType = "Standard",
                            Audio = "Dolby Digital",
                            IsActive = true,
                            TimeToClean = 30,
                            TheaterId = nyTheater.Id
                        },
                        new Room
                        {
                            Name = "Auditorium E",
                            NumOfSeats = 100,
                            rows = 10,
                            columns = 10,
                            ScreenType = "Standard",
                            Audio = "Standard",
                            IsActive = false, // Under renovation
                            TimeToClean = 25,
                            TheaterId = nyTheater.Id
                        },

                        // Los Angeles Theater
                        new Room
                        {
                            Name = "Theater 1",
                            NumOfSeats = 220,
                            rows = 11,
                            columns = 20,
                            ScreenType = "3D Premium",
                            Audio = "Dolby Atmos",
                            IsActive = true,
                            IsPremium = true,
                            TimeToClean = 35,
                            TheaterId = laTheater.Id
                        },
                        new Room
                        {
                            Name = "Theater 2",
                            NumOfSeats = 220,
                            rows = 11,
                            columns = 20,
                            ScreenType = "Standard",
                            Audio = "Dolby Digital",
                            IsActive = true,
                            TimeToClean = 35,
                            TheaterId = laTheater.Id
                        },
                        new Room
                        {
                            Name = "Theater 3",
                            NumOfSeats = 150,
                            rows = 10,
                            columns = 15,
                            ScreenType = "Standard",
                            Audio = "Dolby Digital",
                            IsActive = true,
                            TimeToClean = 25,
                            TheaterId = laTheater.Id
                        },
                        new Room
                        {
                            Name = "Theater 4",
                            NumOfSeats = 90,
                            rows = 9,
                            columns = 10,
                            ScreenType = "Standard",
                            Audio = "Standard",
                            IsActive = true,
                            TimeToClean = 20,
                            TheaterId = laTheater.Id
                        },
                        new Room
                        {
                            Name = "VIP Lounge",
                            NumOfSeats = 40,
                            rows = 4,
                            columns = 10,
                            ScreenType = "Premium",
                            Audio = "Dolby Digital",
                            IsActive = true,
                            IsPremium = true,
                            TimeToClean = 45, // Extra time for premium amenities
                            TheaterId = laTheater.Id
                        }
                    };

                    await dataContext.Rooms.AddRangeAsync(rooms);
                    await dataContext.SaveChangesAsync();
                }
            }
        }
    }
}