using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTheaters
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Look for any theaters.
                if (context.Theaters.Any())
                {
                    return;   // DB has been seeded
                }
                context.Theaters.AddRange(
                    new ()
                    {
                        Active = true,
                        Name = "Lion’s Den Cinemas: New Orleans",
                        Address1 = "123 Main St",
                        City = "New Orleans",
                        State = "LA"
                    },
                    new ()
                    {
                        Active = true,
                        Name = "Lion’s Den Cinemas: New York",
                        Address1 = "456 Elm St",
                        City = "New York",
                        State = "NY"
                    },
                    new ()
                    {
                        Active = false,
                        Name = "Lion’s Den Cinemas: Los Angeles",
                        Address1 = "789 Broadway Ave",
                        City = "Los Angeles",
                        State = "CA"
                    }

                );
                context.SaveChanges();
            }
        }
    }
}
