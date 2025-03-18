using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedSeatTypes
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Seed seat types
                if (!dataContext.SeatTypes.Any())
                {
                    await dataContext.SeatTypes.AddRangeAsync(new List<SeatType>
                {
                    new() { SeatTypes = "Standard" },
                    new() { SeatTypes = "Premium" },
                    new() { SeatTypes = "Recliner" },
                    new() { SeatTypes = "Accessible" },
                    new() { SeatTypes = "VIP" }
                });
                    await dataContext.SaveChangesAsync();
                }
            }
        }

    }
}
