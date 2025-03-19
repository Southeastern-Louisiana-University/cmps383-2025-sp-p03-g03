using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Products;
using Selu383.SP25.P03.Api.Features.Theaters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedProducts
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Only seed if products don't exist
                if (!dataContext.Products.Any())
                {
                    // First, get theaters by name to obtain their IDs
                    var nolaTheater = await dataContext.Theaters
                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: New Orleans");

                    var nyTheater = await dataContext.Theaters
                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: New York");

                    var laTheater = await dataContext.Theaters
                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: Los Angeles");

                    // Make sure theaters exist before adding products
                    if (nolaTheater == null || nyTheater == null || laTheater == null)
                    {
                        throw new Exception("Required theaters not found. Please ensure theaters are seeded first.");
                    }

                    // Create products with the actual theater IDs
                    var products = new List<Product>
                    {
                        // New Orleans Theater (formerly Theater 1 / Grand Cinema)
                        new Product
                        {
                            Name = "Adult Standard",
                            IsActive = true,
                            TheaterId = nolaTheater.Id
                        },
                        new Product
                        {
                            Name = "Child (3-12) Standard",
                            IsActive = true,
                            TheaterId = nolaTheater.Id
                        },
                        new Product
                        {
                            Name = "Senior (65+) Standard",
                            IsActive = true,
                            TheaterId = nolaTheater.Id
                        },
                        new Product
                        {
                            Name = "Adult IMAX",
                            IsActive = true,
                            TheaterId = nolaTheater.Id
                        },
                        new Product
                        {
                            Name = "Child (3-12) IMAX",
                            IsActive = true,
                            TheaterId = nolaTheater.Id
                        },
                        new Product
                        {
                            Name = "Senior (65+) IMAX",
                            IsActive = true,
                            TheaterId = nolaTheater.Id
                        },
                        new Product
                        {
                            Name = "Student Discount",
                            IsActive = true,
                            TheaterId = nolaTheater.Id
                        },
                        new Product
                        {
                            Name = "Tuesday Special",
                            IsActive = true,
                            TheaterId = nolaTheater.Id
                        },
                        
                        // New York Theater (formerly Theater 2 / Starplex)
                        new Product
                        {
                            Name = "Adult Standard",
                            IsActive = true,
                            TheaterId = nyTheater.Id
                        },
                        new Product
                        {
                            Name = "Child (3-12) Standard",
                            IsActive = true,
                            TheaterId = nyTheater.Id
                        },
                        new Product
                        {
                            Name = "Senior (65+) Standard",
                            IsActive = true,
                            TheaterId = nyTheater.Id
                        },
                        new Product
                        {
                            Name = "Adult IMAX",
                            IsActive = true,
                            TheaterId = nyTheater.Id
                        },
                        new Product
                        {
                            Name = "Child (3-12) IMAX",
                            IsActive = true,
                            TheaterId = nyTheater.Id
                        },
                        new Product
                        {
                            Name = "Senior (65+) IMAX",
                            IsActive = true,
                            TheaterId = nyTheater.Id
                        },
                        new Product
                        {
                            Name = "Premium Large Format",
                            IsActive = true,
                            TheaterId = nyTheater.Id
                        },
                        new Product
                        {
                            Name = "Military Discount",
                            IsActive = true,
                            TheaterId = nyTheater.Id
                        },
                        
                        // Los Angeles Theater (formerly Theater 3 / City Lights Theater)
                        new Product
                        {
                            Name = "Adult Standard",
                            IsActive = true,
                            TheaterId = laTheater.Id
                        },
                        new Product
                        {
                            Name = "Child (3-12) Standard",
                            IsActive = true,
                            TheaterId = laTheater.Id
                        },
                        new Product
                        {
                            Name = "Senior (65+) Standard",
                            IsActive = true,
                            TheaterId = laTheater.Id
                        },
                        new Product
                        {
                            Name = "3D Premium Adult",
                            IsActive = true,
                            TheaterId = laTheater.Id
                        },
                        new Product
                        {
                            Name = "3D Premium Child",
                            IsActive = true,
                            TheaterId = laTheater.Id
                        },
                        new Product
                        {
                            Name = "3D Premium Senior",
                            IsActive = true,
                            TheaterId = laTheater.Id
                        },
                        new Product
                        {
                            Name = "VIP Lounge Experience",
                            IsActive = true,
                            TheaterId = laTheater.Id
                        },
                        new Product
                        {
                            Name = "Thursday Member Special",
                            IsActive = true,
                            TheaterId = laTheater.Id
                        }
                    };

                    await dataContext.Products.AddRangeAsync(products);
                    await dataContext.SaveChangesAsync();
                }
            }
        }
    }
}