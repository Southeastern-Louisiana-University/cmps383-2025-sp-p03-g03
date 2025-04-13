//using Microsoft.EntityFrameworkCore;
//using Selu383.SP25.P03.Api.Features.Products;
//using Selu383.SP25.P03.Api.Features.Theaters;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace Selu383.SP25.P03.Api.Data
//{
//    public class SeedProductPrices
//    {
//        public static async Task InitializeAsync(IServiceProvider serviceProvider)
//        {
//            using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
//            {
//                // Only seed if product prices don't exist
//                if (!dataContext.ProductPrices.Any())
//                {
//                    // First, get all theaters to organize products by theater
//                    var nolaTheater = await dataContext.Theaters
//                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: New Orleans");

//                    var nyTheater = await dataContext.Theaters
//                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: New York");

//                    var laTheater = await dataContext.Theaters
//                        .FirstOrDefaultAsync(t => t.Name == "Lion’s Den Cinemas: Los Angeles");

//                    // Make sure theaters exist before proceeding
//                    if (nolaTheater == null || nyTheater == null || laTheater == null)
//                    {
//                        throw new Exception("Required theaters not found. Please ensure theaters are seeded first.");
//                    }

//                    // Get all products grouped by theater
//                    var products = await dataContext.Products.ToListAsync();

//                    // Group products by theater and name for easier lookup
//                    var productsByTheaterAndName = products.ToDictionary(
//                        p => (p.TheaterId, p.Name),
//                        p => p.Id
//                    );

//                    // Helper function to get product ID
//                    int GetProductId(int theaterId, string productName)
//                    {
//                        if (productsByTheaterAndName.TryGetValue((theaterId, productName), out int productId))
//                        {
//                            return productId;
//                        }
//                        throw new Exception($"Product '{productName}' not found for theater ID {theaterId}. Ensure products are seeded first.");
//                    }

//                    // Date setup
//                    var today = DateOnly.FromDateTime(DateTime.Now);
//                    var twoMonthsAgo = today.AddMonths(-2);
//                    var oneMonthAgo = today.AddMonths(-1);
//                    var nextMonth = today.AddMonths(1);
//                    var twoMonthsFromNow = today.AddMonths(2);

//                    // Create list to hold all product prices
//                    var productPrices = new List<ProductPrice>();

//                    // Theater 1 - New Orleans
//                    // Adult Standard - Previous prices with end dates
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Adult Standard"),
//                        Price = 12.99m,
//                        StartDate = twoMonthsAgo,
//                        EndDate = oneMonthAgo
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Adult Standard"),
//                        Price = 13.49m,
//                        StartDate = oneMonthAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Adult Standard"),
//                        Price = 13.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Child Standard - Previous and current
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Child (3-12) Standard"),
//                        Price = 8.99m,
//                        StartDate = twoMonthsAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Child (3-12) Standard"),
//                        Price = 9.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Senior Standard - Previous and current
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Senior (65+) Standard"),
//                        Price = 9.99m,
//                        StartDate = twoMonthsAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Senior (65+) Standard"),
//                        Price = 10.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Adult IMAX - Previous and current
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Adult IMAX"),
//                        Price = 15.99m,
//                        StartDate = twoMonthsAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Adult IMAX"),
//                        Price = 16.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Child IMAX - Previous and current
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Child (3-12) IMAX"),
//                        Price = 11.99m,
//                        StartDate = twoMonthsAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Child (3-12) IMAX"),
//                        Price = 12.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Senior IMAX - Previous and current
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Senior (65+) IMAX"),
//                        Price = 12.99m,
//                        StartDate = twoMonthsAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Senior (65+) IMAX"),
//                        Price = 13.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Student Discount - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Student Discount"),
//                        Price = 11.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Tuesday Special - Previous, current and scheduled future price
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Tuesday Special"),
//                        Price = 7.99m,
//                        StartDate = twoMonthsAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Tuesday Special"),
//                        Price = 8.99m,
//                        StartDate = today,
//                        EndDate = nextMonth
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nolaTheater.Id, "Tuesday Special"),
//                        Price = 9.99m,
//                        StartDate = nextMonth,
//                        EndDate = null
//                    });

//                    // Theater 2 - New York (formerly Starplex)

//                    // Adult Standard - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Adult Standard"),
//                        Price = 14.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Child Standard - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Child (3-12) Standard"),
//                        Price = 10.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Senior Standard - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Senior (65+) Standard"),
//                        Price = 11.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Adult IMAX - Current only with scheduled increase
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Adult IMAX"),
//                        Price = 17.99m,
//                        StartDate = today,
//                        EndDate = twoMonthsFromNow
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Adult IMAX"),
//                        Price = 18.99m,
//                        StartDate = twoMonthsFromNow,
//                        EndDate = null
//                    });

//                    // Child IMAX - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Child (3-12) IMAX"),
//                        Price = 13.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Senior IMAX - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Senior (65+) IMAX"),
//                        Price = 14.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Premium Large Format - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Premium Large Format"),
//                        Price = 16.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Military Discount - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(nyTheater.Id, "Military Discount"),
//                        Price = 11.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Theater 3 - Los Angeles (formerly City Lights Theater)

//                    // Adult Standard - Previous and current
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "Adult Standard"),
//                        Price = 14.99m,
//                        StartDate = oneMonthAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "Adult Standard"),
//                        Price = 15.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Child Standard - Previous and current
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "Child (3-12) Standard"),
//                        Price = 10.99m,
//                        StartDate = oneMonthAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "Child (3-12) Standard"),
//                        Price = 11.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Senior Standard - Previous and current
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "Senior (65+) Standard"),
//                        Price = 11.99m,
//                        StartDate = oneMonthAgo,
//                        EndDate = today
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "Senior (65+) Standard"),
//                        Price = 12.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // 3D Premium Adult - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "3D Premium Adult"),
//                        Price = 18.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // 3D Premium Child - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "3D Premium Child"),
//                        Price = 14.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // 3D Premium Senior - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "3D Premium Senior"),
//                        Price = 15.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // VIP Lounge Experience - Current and scheduled special event price
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "VIP Lounge Experience"),
//                        Price = 24.99m,
//                        StartDate = today,
//                        EndDate = nextMonth
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "VIP Lounge Experience"),
//                        Price = 29.99m,
//                        StartDate = nextMonth,
//                        EndDate = twoMonthsFromNow
//                    });
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "VIP Lounge Experience"),
//                        Price = 24.99m,
//                        StartDate = twoMonthsFromNow,
//                        EndDate = null
//                    });

//                    // Thursday Member Special - Current only
//                    productPrices.Add(new ProductPrice
//                    {
//                        ProductId = GetProductId(laTheater.Id, "Thursday Member Special"),
//                        Price = 10.99m,
//                        StartDate = today,
//                        EndDate = null
//                    });

//                    // Add all product prices to the database
//                    await dataContext.ProductPrices.AddRangeAsync(productPrices);
//                    await dataContext.SaveChangesAsync();
//                }
//            }
//        }
//    }
//}