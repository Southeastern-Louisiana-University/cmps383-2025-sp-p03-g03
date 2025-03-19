using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Movies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                    // First, get all movies to create a lookup dictionary by title
                    var movies = await dataContext.Movies.ToListAsync();

                    if (!movies.Any())
                    {
                        throw new Exception("No movies found in the database. Please ensure movies are seeded first.");
                    }

                    // Create a dictionary with movie titles as keys and movie IDs as values
                    var movieDictionary = movies.ToDictionary(
                        m => m.Title,
                        m => m.Id
                    );

                    // Helper function to get movie ID by title
                    int GetMovieId(string title)
                    {
                        if (movieDictionary.TryGetValue(title, out int movieId))
                        {
                            return movieId;
                        }
                        throw new Exception($"Movie '{title}' not found in the database. Please ensure it is seeded first.");
                    }

                    var now = DateTime.Now.Date;
                    var movieSchedules = new List<MovieSchedule>();

                    // Dune: Part Two
                    movieSchedules.Add(new MovieSchedule
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
                        MovieId = GetMovieId("Dune: Part Two")
                    });

                    // Godzilla x Kong
                    movieSchedules.Add(new MovieSchedule
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
                        MovieId = GetMovieId("Godzilla x Kong: The New Empire")
                    });

                    // Kingdom of the Planet of the Apes
                    movieSchedules.Add(new MovieSchedule
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
                        MovieId = GetMovieId("Kingdom of the Planet of the Apes")
                    });

                    // Ghostbusters: Frozen Empire
                    movieSchedules.Add(new MovieSchedule
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
                        MovieId = GetMovieId("Ghostbusters: Frozen Empire")
                    });

                    // The Fall Guy
                    movieSchedules.Add(new MovieSchedule
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
                        MovieId = GetMovieId("The Fall Guy")
                    });

                    // A Quiet Place: Day One - Coming soon, fewer showtimes
                    movieSchedules.Add(new MovieSchedule
                    {
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(10).AddHours(19),
                            now.AddDays(10).AddHours(21).AddMinutes(30),
                            now.AddDays(11).AddHours(19),
                            now.AddDays(11).AddHours(21).AddMinutes(30)
                        },
                        IsActive = true,
                        MovieId = GetMovieId("A Quiet Place: Day One")
                    });

                    // Inside Out 2 - Coming soon, preview screenings
                    movieSchedules.Add(new MovieSchedule
                    {
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(7).AddHours(18),
                            now.AddDays(7).AddHours(20).AddMinutes(30),
                            now.AddDays(8).AddHours(18),
                            now.AddDays(8).AddHours(20).AddMinutes(30)
                        },
                        IsActive = true,
                        MovieId = GetMovieId("Inside Out 2")
                    });

                    // Furiosa - Coming soon, midnight preview
                    movieSchedules.Add(new MovieSchedule
                    {
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(5).AddHours(0), // Midnight show
                            now.AddDays(5).AddHours(19),
                            now.AddDays(5).AddHours(22)
                        },
                        IsActive = true,
                        MovieId = GetMovieId("Furiosa: A Mad Max Saga")
                    });

                    // Deadpool & Wolverine - Future release, not many showtimes yet
                    movieSchedules.Add(new MovieSchedule
                    {
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(30).AddHours(19),
                            now.AddDays(30).AddHours(21).AddMinutes(30)
                        },
                        IsActive = true,
                        MovieId = GetMovieId("Deadpool & Wolverine")
                    });

                    // Bad Boys: Ride or Die
                    movieSchedules.Add(new MovieSchedule
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
                        MovieId = GetMovieId("Bad Boys: Ride or Die")
                    });

                    // The Garfield Movie - Family film, more matinee times
                    movieSchedules.Add(new MovieSchedule
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
                        MovieId = GetMovieId("The Garfield Movie")
                    });

                    // Oppenheimer - Limited re-release
                    movieSchedules.Add(new MovieSchedule
                    {
                        MovieTimes = new DateTime[]
                        {
                            now.AddDays(4).AddHours(19), // Special screening
                            now.AddDays(5).AddHours(19)  // Special screening
                        },
                        IsActive = false,
                        MovieId = GetMovieId("Oppenheimer")
                    });

                    await dataContext.MovieSchedules.AddRangeAsync(movieSchedules);
                    await dataContext.SaveChangesAsync();
                }
            }
        }
    }
}