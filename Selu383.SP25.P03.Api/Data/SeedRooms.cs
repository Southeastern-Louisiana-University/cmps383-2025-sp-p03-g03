using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Rooms;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedRooms
    {

            public static async Task InitializeAsync(IServiceProvider serviceProvider)
            {
                using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
                {
                    // Seed Rooms
                    if (!dataContext.Rooms.Any())
                    {
                        await dataContext.Rooms.AddRangeAsync(new List<Room>
                {
                    
                    new ()
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
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Room 2",
                        NumOfSeats = 150,
                        rows = 10,
                        columns = 15,
                        ScreenType = "Standard",
                        Audio = "Dolby Digital",
                        IsActive = true,
                        TimeToClean = 25,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Room 3",
                        NumOfSeats = 80,
                        rows = 8,
                        columns = 10,
                        ScreenType = "Standard",
                        Audio = "Dolby Digital",
                        IsActive = true,
                        TimeToClean = 20,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Room 4",
                        NumOfSeats = 60,
                        rows = 6,
                        columns = 10,
                        ScreenType = "Standard",
                        Audio = "Standard",
                        IsActive = true,
                        TimeToClean = 15,
                        TheaterId = 1
                    },

                    // Starplex (TheaterId = 2)
                    new ()
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
                        TheaterId = 2
                    },
                    new ()
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
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Auditorium C",
                        NumOfSeats = 180,
                        rows = 12,
                        columns = 15,
                        ScreenType = "Standard",
                        Audio = "Dolby Digital",
                        IsActive = true,
                        TimeToClean = 30,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Auditorium D",
                        NumOfSeats = 180,
                        rows = 12,
                        columns = 15,
                        ScreenType = "Standard",
                        Audio = "Dolby Digital",
                        IsActive = true,
                        TimeToClean = 30,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Auditorium E",
                        NumOfSeats = 100,
                        rows = 10,
                        columns = 10,
                        ScreenType = "Standard",
                        Audio = "Standard",
                        IsActive = false, // Under renovation
                        TimeToClean = 25,
                        TheaterId = 2
                    },

                    // City Lights Theater (TheaterId = 3)
                    new ()
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
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "Theater 2",
                        NumOfSeats = 220,
                        rows = 11,
                        columns = 20,
                        ScreenType = "Standard",
                        Audio = "Dolby Digital",
                        IsActive = true,
                        TimeToClean = 35,
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "Theater 3",
                        NumOfSeats = 150,
                        rows = 10,
                        columns = 15,
                        ScreenType = "Standard",
                        Audio = "Dolby Digital",
                        IsActive = true,
                        TimeToClean = 25,
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "Theater 4",
                        NumOfSeats = 90,
                        rows = 9,
                        columns = 10,
                        ScreenType = "Standard",
                        Audio = "Standard",
                        IsActive = true,
                        TimeToClean = 20,
                        TheaterId = 3
                    },
                    new ()
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
                        TheaterId = 3
                    }
                });

                        await dataContext.SaveChangesAsync();
                    }
                }
            }
        }
    }

