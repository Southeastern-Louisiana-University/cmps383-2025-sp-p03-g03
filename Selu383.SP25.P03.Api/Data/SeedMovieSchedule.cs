using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Data
{


public static class SeedMovieSchedule
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Seed Movie Schedules
                if (!dataContext.MovieSchedules.Any())
                {
                    var now = DateTime.Now.Date;

                    await dataContext.MovieSchedules.AddRangeAsync(new List<MovieSchedule>
                {
                    // Dune: Part Two (1)
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(1).AddHours(10).AddMinutes(30),
                            now.AddDays(1).AddHours(14),
                            now.AddDays(1).AddHours(17).AddMinutes(30),
                            now.AddDays(1).AddHours(21),
                            now.AddDays(2).AddHours(10).AddMinutes(30),
                            now.AddDays(2).AddHours(14),
                            now.AddDays(2).AddHours(17).AddMinutes(30),
                            now.AddDays(2).AddHours(21)
                        },
                        IsActive = true,
                        MovieId = 1
                    },
                    
                    // Godzilla x Kong (2)
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(1).AddHours(11).AddMinutes(15),
                            now.AddDays(1).AddHours(13).AddMinutes(45),
                            now.AddDays(1).AddHours(16).AddMinutes(15),
                            now.AddDays(1).AddHours(18).AddMinutes(45),
                            now.AddDays(1).AddHours(21).AddMinutes(15),
                            now.AddDays(2).AddHours(11).AddMinutes(15),
                            now.AddDays(2).AddHours(13).AddMinutes(45),
                            now.AddDays(2).AddHours(16).AddMinutes(15),
                            now.AddDays(2).AddHours(18).AddMinutes(45),
                            now.AddDays(2).AddHours(21).AddMinutes(15)
                        },
                        IsActive = true,
                        MovieId = 2
                    },
                    
                    // Kingdom of the Planet of the Apes (3)
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(1).AddHours(12),
                            now.AddDays(1).AddHours(15),
                            now.AddDays(1).AddHours(18),
                            now.AddDays(1).AddHours(21),
                            now.AddDays(2).AddHours(12),
                            now.AddDays(2).AddHours(15),
                            now.AddDays(2).AddHours(18),
                            now.AddDays(2).AddHours(21)
                        },
                        IsActive = true,
                        MovieId = 3
                    },
                    
                    // Ghostbusters: Frozen Empire (4)
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(1).AddHours(10),
                            now.AddDays(1).AddHours(12).AddMinutes(30),
                            now.AddDays(1).AddHours(15),
                            now.AddDays(1).AddHours(17).AddMinutes(30),
                            now.AddDays(1).AddHours(20),
                            now.AddDays(2).AddHours(10),
                            now.AddDays(2).AddHours(12).AddMinutes(30),
                            now.AddDays(2).AddHours(15),
                            now.AddDays(2).AddHours(17).AddMinutes(30),
                            now.AddDays(2).AddHours(20)
                        },
                        IsActive = true,
                        MovieId = 4
                    },
                    
                    // The Fall Guy (5)
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(1).AddHours(11),
                            now.AddDays(1).AddHours(13).AddMinutes(30),
                            now.AddDays(1).AddHours(16),
                            now.AddDays(1).AddHours(18).AddMinutes(30),
                            now.AddDays(1).AddHours(21),
                            now.AddDays(2).AddHours(11),
                            now.AddDays(2).AddHours(13).AddMinutes(30),
                            now.AddDays(2).AddHours(16),
                            now.AddDays(2).AddHours(18).AddMinutes(30),
                            now.AddDays(2).AddHours(21)
                        },
                        IsActive = true,
                        MovieId = 5
                    },
                    
                    // A Quiet Place: Day One (6) - Coming soon, fewer showtimes
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(10).AddHours(19),
                            now.AddDays(10).AddHours(21).AddMinutes(30),
                            now.AddDays(11).AddHours(19),
                            now.AddDays(11).AddHours(21).AddMinutes(30)
                        },
                        IsActive = true,
                        MovieId = 6
                    },
                    
                    // Inside Out 2 (7) - Coming soon, preview screenings
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(7).AddHours(18),
                            now.AddDays(7).AddHours(20).AddMinutes(30),
                            now.AddDays(8).AddHours(18),
                            now.AddDays(8).AddHours(20).AddMinutes(30)
                        },
                        IsActive = true,
                        MovieId = 7
                    },
                    
                    // Furiosa (8) - Coming soon, midnight preview
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(5).AddHours(0), // Midnight show
                            now.AddDays(5).AddHours(19),
                            now.AddDays(5).AddHours(22)
                        },
                        IsActive = true,
                        MovieId = 8
                    },
                    
                    // Deadpool & Wolverine (9) - Future release, not many showtimes yet
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(30).AddHours(19),
                            now.AddDays(30).AddHours(21).AddMinutes(30)
                        },
                        IsActive = true,
                        MovieId = 9
                    },
                    
                    // Bad Boys: Ride or Die (10)
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(1).AddHours(14).AddMinutes(30),
                            now.AddDays(1).AddHours(17),
                            now.AddDays(1).AddHours(19).AddMinutes(30),
                            now.AddDays(1).AddHours(22),
                            now.AddDays(2).AddHours(14).AddMinutes(30),
                            now.AddDays(2).AddHours(17),
                            now.AddDays(2).AddHours(19).AddMinutes(30),
                            now.AddDays(2).AddHours(22)
                        },
                        IsActive = true,
                        MovieId = 10
                    },
                    
                    // The Garfield Movie (11) - Family film, more matinee times
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(1).AddHours(9).AddMinutes(30), // Early for kids
                            now.AddDays(1).AddHours(11).AddMinutes(45),
                            now.AddDays(1).AddHours(14),
                            now.AddDays(1).AddHours(16).AddMinutes(15),
                            now.AddDays(1).AddHours(18).AddMinutes(30),
                            now.AddDays(2).AddHours(9).AddMinutes(30),
                            now.AddDays(2).AddHours(11).AddMinutes(45),
                            now.AddDays(2).AddHours(14),
                            now.AddDays(2).AddHours(16).AddMinutes(15),
                            now.AddDays(2).AddHours(18).AddMinutes(30)
                        },
                        IsActive = true,
                        MovieId = 11
                    },
                    
                    // Oppenheimer (12) - Limited re-release
                    new ()
                    {
                        
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(4).AddHours(19), // Special screening
                            now.AddDays(5).AddHours(19)  // Special screening
                        },
                        IsActive = false,
                        MovieId = 12
                    }
                });

                    await dataContext.SaveChangesAsync();
                }
            }
        }
    }

}

