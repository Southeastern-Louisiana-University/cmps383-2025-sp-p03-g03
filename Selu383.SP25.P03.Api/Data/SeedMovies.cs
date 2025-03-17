using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedMovies
    {
            public static async Task InitializeAsync(IServiceProvider serviceProvider)
            {
                using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
                {
                    // Seed Movies
                    if (!dataContext.Movies.Any())
                    {
                        await dataContext.Movies.AddRangeAsync(new List<Movie>
                {
                    new ()
                    {
                        
                        Title = "Dune: Part Two",
                        Description = "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                        Category = "Science Fiction",
                        Runtime = 166,
                        IsActive = true,
                        AgeRating = "PG-13",
                        ReleaseDate = new DateTime(2024, 3, 1)
                    },
                    new ()
                    {
                        
                        Title = "Godzilla x Kong: The New Empire",
                        Description = "Two titans, Kong and Godzilla, clash in a spectacular battle for the ages as a terrifying new threat emerges.",
                        Category = "Action/Adventure",
                        Runtime = 115,
                        IsActive = true,
                        AgeRating = "PG-13",
                        ReleaseDate = new DateTime(2024, 3, 29)
                    },
                    new ()
                    {
                        
                        Title = "Kingdom of the Planet of the Apes",
                        Description = "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught about the past.",
                        Category = "Science Fiction",
                        Runtime = 145,
                        IsActive = true,
                        AgeRating = "PG-13",
                        ReleaseDate = new DateTime(2024, 5, 10)
                    },
                    new ()
                    {
                        
                        Title = "Ghostbusters: Frozen Empire",
                        Description = "The Spengler family returns to where it all started – the iconic New York City firehouse – to team up with the original Ghostbusters.",
                        Category = "Comedy/Fantasy",
                        Runtime = 115,
                        IsActive = true,
                        AgeRating = "PG-13",
                        ReleaseDate = new DateTime(2024, 3, 22)
                    },
                    new ()
                    {
                        
                        Title = "The Fall Guy",
                        Description = "Colt Seavers, a battle-scarred stuntman who, having left the business a year earlier to focus on both physical and mental health, is drafted back into service.",
                        Category = "Action/Comedy",
                        Runtime = 126,
                        IsActive = true,
                        AgeRating = "PG-13",
                        ReleaseDate = new DateTime(2024, 5, 3)
                    },
                    new ()
                    {
                        
                        Title = "A Quiet Place: Day One",
                        Description = "Experience the day the world went quiet in this prequel to the original films, set in New York City during the beginning of the alien invasion.",
                        Category = "Horror/Thriller",
                        Runtime = 100,
                        IsActive = true,
                        AgeRating = "PG-13",
                        ReleaseDate = new DateTime(2024, 6, 28)
                    },
                    new ()
                    {
                        
                        Title = "Inside Out 2",
                        Description = "As Riley enters her teenage years, new emotions join her emotional team, causing upheaval in Headquarters.",
                        Category = "Animation/Family",
                        Runtime = 107,
                        IsActive = true,
                        AgeRating = "PG",
                        ReleaseDate = new DateTime(2024, 6, 14)
                    },
                    new ()
                    {
                        
                        Title = "Furiosa: A Mad Max Saga",
                        Description = "The origin story of renegade warrior Furiosa before her encounter with Mad Max.",
                        Category = "Action/Adventure",
                        Runtime = 148,
                        IsActive = true,
                        AgeRating = "R",
                        ReleaseDate = new DateTime(2024, 5, 24)
                    },
                    new ()
                    {
                        
                        Title = "Deadpool & Wolverine",
                        Description = "Deadpool teams up with Wolverine for an adventure that will change the Marvel Cinematic Universe forever.",
                        Category = "Action/Comedy",
                        Runtime = 127,
                        IsActive = true,
                        AgeRating = "R",
                        ReleaseDate = new DateTime(2024, 7, 26)
                    },
                    new ()
                    {
                        
                        Title = "Bad Boys: Ride or Die",
                        Description = "Mike Lowrey and Marcus Burnett are back for one last ride in the fourth installment of the Bad Boys franchise.",
                        Category = "Action/Comedy",
                        Runtime = 115,
                        IsActive = true,
                        AgeRating = "R",
                        ReleaseDate = new DateTime(2024, 6, 7)
                    },
                    new ()
                    {
                        
                        Title = "The Garfield Movie",
                        Description = "Garfield, the world-famous, Monday-hating, lasagna-loving indoor cat, is about to have a wild outdoor adventure.",
                        Category = "Animation/Family",
                        Runtime = 101,
                        IsActive = true,
                        AgeRating = "PG",
                        ReleaseDate = new DateTime(2024, 5, 24)
                    },
                    new ()
                    {
                        
                        Title = "Oppenheimer",
                        Description = "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
                        Category = "Biography/Drama",
                        Runtime = 180,
                        IsActive = false,
                        AgeRating = "R",
                        ReleaseDate = new DateTime(2023, 7, 21)
                    }
                });

                        await dataContext.SaveChangesAsync();
                    }
                }
            }
        }
    }
