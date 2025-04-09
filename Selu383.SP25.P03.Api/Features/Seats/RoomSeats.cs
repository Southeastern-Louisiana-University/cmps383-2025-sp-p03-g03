using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Selu383.SP25.P03.Api.Controllers;
using Selu383.SP25.P03.Api.Features.Rooms;

namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class RoomSeats : IEntity
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int SeatId { get; set; }
        public Room? Room { get; set; }
        public Seat? Seat { get; set; }
    }
    public class RoomSeatsDto
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int SeatId { get; set; }
    }
    public class RoomSeatsConfiguration : IEntityTypeConfiguration<RoomSeats>
    {
        public void Configure(EntityTypeBuilder<RoomSeats> builder)
        {
            builder.HasOne(p => p.Room)
                .WithMany()
                .HasForeignKey(p => p.RoomId);
               
        }
    }
}
