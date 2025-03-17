using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Products;

namespace Selu383.SP25.P03.Api.Data
{
    public class SeedProductPrices
    {


            public static async Task InitializeAsync(IServiceProvider serviceProvider)
            {
                using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
                {
                    // Seed Product Prices
                    if (!dataContext.ProductPrices.Any())
                    {
                        var today = DateOnly.FromDateTime(DateTime.Now);
                        var twoMonthsAgo = today.AddMonths(-2);
                        var oneMonthAgo = today.AddMonths(-1);
                        var nextMonth = today.AddMonths(1);
                        var twoMonthsFromNow = today.AddMonths(2);

                        await dataContext.ProductPrices.AddRangeAsync(new List<ProductPrice>
                {
                    // Theater 1 (Grand Cinema) Ticket Prices
                    
                    // Adult Standard - Previous prices with end dates
                    new () { ProductId = 1, Price = 12.99m, StartDate = twoMonthsAgo, EndDate = oneMonthAgo },
                    new () { ProductId = 1, Price = 13.49m, StartDate = oneMonthAgo, EndDate = today },
                    // Current price
                    new () { ProductId = 1, Price = 13.99m, StartDate = today, EndDate = null },
                    
                    // Child Standard - Previous and current
                    new () { ProductId = 2, Price = 8.99m, StartDate = twoMonthsAgo, EndDate = today },
                    new () { ProductId = 2, Price = 9.99m, StartDate = today, EndDate = null },
                    
                    // Senior Standard - Previous and current
                    new () { ProductId = 3, Price = 9.99m, StartDate = twoMonthsAgo, EndDate = today },
                    new () { ProductId = 3, Price = 10.99m, StartDate = today, EndDate = null },
                    
                    // Adult IMAX - Previous and current
                    new () { ProductId = 4, Price = 15.99m, StartDate = twoMonthsAgo, EndDate = today },
                    new () { ProductId = 4, Price = 16.99m, StartDate = today, EndDate = null },
                    
                    // Child IMAX - Previous and current
                    new () { ProductId = 5, Price = 11.99m, StartDate = twoMonthsAgo, EndDate = today },
                    new () { ProductId = 5, Price = 12.99m, StartDate = today, EndDate = null },
                    
                    // Senior IMAX - Previous and current
                    new () { ProductId = 6, Price = 12.99m, StartDate = twoMonthsAgo, EndDate = today },
                    new () { ProductId = 6, Price = 13.99m, StartDate = today, EndDate = null },
                    
                    // Student Discount - Current only
                    new () { ProductId = 7, Price = 11.99m, StartDate = today, EndDate = null },
                    
                    // Tuesday Special - Previous, current and scheduled future price
                    new () { ProductId = 8, Price = 7.99m, StartDate = twoMonthsAgo, EndDate = today },
                    new () { ProductId = 8, Price = 8.99m, StartDate = today, EndDate = nextMonth },
                    new () { ProductId = 8, Price = 9.99m, StartDate = nextMonth, EndDate = null },
                    
                    // Theater 2 (Starplex) Ticket Prices
                    
                    // Adult Standard - Current only
                    new () { ProductId = 9, Price = 14.99m, StartDate = today, EndDate = null },
                    
                    // Child Standard - Current only
                    new () { ProductId = 10, Price = 10.99m, StartDate = today, EndDate = null },
                    
                    // Senior Standard - Current only
                    new () { ProductId = 11, Price = 11.99m, StartDate = today, EndDate = null },
                    
                    // Adult IMAX - Current only with scheduled increase
                    new () { ProductId = 12, Price = 17.99m, StartDate = today, EndDate = twoMonthsFromNow },
                    new () { ProductId = 12, Price = 18.99m, StartDate = twoMonthsFromNow, EndDate = null },
                    
                    // Child IMAX - Current only
                    new () { ProductId = 13, Price = 13.99m, StartDate = today, EndDate = null },
                    
                    // Senior IMAX - Current only
                    new () { ProductId = 14, Price = 14.99m, StartDate = today, EndDate = null },
                    
                    // Premium Large Format - Current only
                    new () { ProductId = 15, Price = 16.99m, StartDate = today, EndDate = null },
                    
                    // Military Discount - Current only
                    new () { ProductId = 16, Price = 11.99m, StartDate = today, EndDate = null },
                    
                    // Theater 3 (City Lights Theater) Ticket Prices
                    
                    // Adult Standard - Previous and current
                    new () { ProductId = 17, Price = 14.99m, StartDate = oneMonthAgo, EndDate = today },
                    new () { ProductId = 17, Price = 15.99m, StartDate = today, EndDate = null },
                    
                    // Child Standard - Previous and current
                    new () { ProductId = 18, Price = 10.99m, StartDate = oneMonthAgo, EndDate = today },
                    new () { ProductId = 18, Price = 11.99m, StartDate = today, EndDate = null },
                    
                    // Senior Standard - Previous and current
                    new () { ProductId = 19, Price = 11.99m, StartDate = oneMonthAgo, EndDate = today },
                    new () { ProductId = 19, Price = 12.99m, StartDate = today, EndDate = null },
                    
                    // 3D Premium Adult - Current only
                    new () { ProductId = 20, Price = 18.99m, StartDate = today, EndDate = null },
                    
                    // 3D Premium Child - Current only
                    new () { ProductId = 21, Price = 14.99m, StartDate = today, EndDate = null },
                    
                    // 3D Premium Senior - Current only
                    new () { ProductId = 22, Price = 15.99m, StartDate = today, EndDate = null },
                    
                    // VIP Lounge Experience - Current and scheduled special event price
                    new () { ProductId = 23, Price = 24.99m, StartDate = today, EndDate = nextMonth },
                    new () { ProductId = 23, Price = 29.99m, StartDate = nextMonth, EndDate = twoMonthsFromNow },
                    new () { ProductId = 23, Price = 24.99m, StartDate = twoMonthsFromNow, EndDate = null },
                    
                    // Thursday Member Special - Current only
                    new () { ProductId = 24, Price = 10.99m, StartDate = today, EndDate = null }
                });

                        await dataContext.SaveChangesAsync();
                    }
                }
            }
        }

    }

