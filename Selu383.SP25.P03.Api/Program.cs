
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Scalar.AspNetCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // CJD 03082025
            builder.Services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DataContext")
                ?? throw new InvalidOperationException("Connection string 'DataContext' not found."))

                //.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                .EnableDetailedErrors()
                );


            // Add mapper for generic controller
            builder.Services.AddAutoMapper(typeof(MappingProfile));

            // Add SPA static files support
            //builder.Services.AddSpaStaticFiles(configuration => {
            //    configuration.RootPath = "wwwroot";
            //});


            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddRazorPages();
           
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            builder.Services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = false;
            });

            builder.Services.ConfigureApplicationCookie(options =>
            {
                // Cookie settings
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = 403;
                    return Task.CompletedTask;
                };

                options.SlidingExpiration = true;
            });
            builder.Services.AddHttpClient(); 


            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<DataContext>();

                await db.Database.MigrateAsync();

                //SeedTheaters.Initialize(scope.ServiceProvider);
                await SeedRoles.Initialize(scope.ServiceProvider);
                await SeedUsers.Initialize(scope.ServiceProvider);
                // await SeedRooms.InitializeAsync(scope.ServiceProvider);
                // await SeedMovies.InitializeAsync(scope.ServiceProvider);
                // await SeedMovieRoomScheduleLinks.InitializeAsync(scope.ServiceProvider);
                // await SeedMovieSchedule.InitializeAsync(scope.ServiceProvider);
                // await SeedProducts.InitializeAsync(scope.ServiceProvider);
                // await SeedProductPrices.InitializeAsync(scope.ServiceProvider);
                // await SeedSeats.InitializeAsync(scope.ServiceProvider);
                // await SeedSeatTypes.InitializeAsync(scope.ServiceProvider);

            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }



            app.UseCors();
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseRouting()
               .UseAuthorization()
               .UseEndpoints(x =>
               {
                   x.MapControllers();

                   // Add Scalar API reference
                   // https://localhost:7027/scalar/
                   x.MapScalarApiReference();
               });
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSpa(x =>
                {
                    x.UseProxyToSpaDevelopmentServer("http://localhost:5173");
                });
            }
            else
            {
                app.MapFallbackToFile("/index.html");
            }


            


            app.Run();
        }
    }
}
