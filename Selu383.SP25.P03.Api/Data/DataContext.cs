using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Products;
using Selu383.SP25.P03.Api.Features.Promos;
using Selu383.SP25.P03.Api.Features.Tickets;
using System.Reflection.Emit;
using System.Reflection;
using Selu383.SP25.P03.Api.Features.Rooms;

namespace Selu383.SP25.P03.Api.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<MovieSchedule> MovieSchedules { get; set; }
        public DbSet<MovieRoomScheduleLink> MovieRoomScheduleLinks { get; set; }
        public DbSet<MoviePoster> MoviePoster { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductPrice> ProductPrices { get; set; }

        public DbSet<Promo> Promos { get; set; }
        public DbSet<PromoSchedule> PromoSchedules { get; set; }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<Seat> Seats { get; set; }
        public DbSet<SeatType> SeatTypes { get; set; }

        public DbSet<Theater> Theaters { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<UserTicket> UserTickets { get; set; }
        public DbSet<RoomSeats> RoomSeats { get; set; }
        public DbSet<ProductTypes> ProductTypes { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            
            
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(typeof(DataContext).GetTypeInfo().Assembly);


            //builder.Entity<UserRole>().HasKey(x => new { x.UserId, x.RoleId });

            //builder.Entity<User>()
            //    .HasMany(e => e.UserRoles)
            //    .WithOne(x => x.User)
            //    .HasForeignKey(e => e.UserId)
            //    .IsRequired()
            //    .OnDelete(DeleteBehavior.Cascade);

            //builder.Entity<Role>()
            //    .HasMany(e => e.UserRoles)
            //    .WithOne(x => x.Role)
            //    .HasForeignKey(e => e.RoleId)
            //    .IsRequired()
            //    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
