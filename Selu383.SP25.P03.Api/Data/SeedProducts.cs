using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Products;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedProducts
    {

        
            public static async Task InitializeAsync(IServiceProvider serviceProvider)
            {
                using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
                {
                    // Seed Product Ticket Types
                    if (!dataContext.Products.Any())
                    {
                        await dataContext.Products.AddRangeAsync(new List<Product>
                {
                    // Theater 1 (Grand Cinema) Tickets
                    new ()
                    {
                        
                        Name = "Adult Standard",
                        IsActive = true,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Child (3-12) Standard",
                        IsActive = true,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Senior (65+) Standard",
                        IsActive = true,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Adult IMAX",
                        IsActive = true,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Child (3-12) IMAX",
                        IsActive = true,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Senior (65+) IMAX",
                        IsActive = true,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Student Discount",
                        IsActive = true,
                        TheaterId = 1
                    },
                    new ()
                    {
                        
                        Name = "Tuesday Special",
                        IsActive = true,
                        TheaterId = 1
                    },
                    
                    // Theater 2 (Starplex) Tickets
                    new ()
                    {
                       
                        Name = "Adult Standard",
                        IsActive = true,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Child (3-12) Standard",
                        IsActive = true,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Senior (65+) Standard",
                        IsActive = true,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Adult IMAX",
                        IsActive = true,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Child (3-12) IMAX",
                        IsActive = true,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Senior (65+) IMAX",
                        IsActive = true,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Premium Large Format",
                        IsActive = true,
                        TheaterId = 2
                    },
                    new ()
                    {
                        
                        Name = "Military Discount",
                        IsActive = true,
                        TheaterId = 2
                    },
                    
                    // Theater 3 (City Lights Theater) Tickets
                    new ()
                    {
                        
                        Name = "Adult Standard",
                        IsActive = true,
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "Child (3-12) Standard",
                        IsActive = true,
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "Senior (65+) Standard",
                        IsActive = true,
                        TheaterId = 3
                    },
                    new ()
                    {
                       
                        Name = "3D Premium Adult",
                        IsActive = true,
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "3D Premium Child",
                        IsActive = true,
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "3D Premium Senior",
                        IsActive = true,
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "VIP Lounge Experience",
                        IsActive = true,
                        TheaterId = 3
                    },
                    new ()
                    {
                        
                        Name = "Thursday Member Special",
                        IsActive = true,
                        TheaterId = 3
                    }
                });

                        await dataContext.SaveChangesAsync();
                    }
                }
            }
        }
    }

