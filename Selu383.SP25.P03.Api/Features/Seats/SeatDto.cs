using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;
using Selu383.SP25.P03.Api.Features.Rooms;

namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class Seat : IEntity
    {
        public int Id { get; set; }
        public int SeatTypeId { get; set; }
        public int RoomsId { get; set; }
        public bool isAvailable { get; set; }
        public string Row { get; set; }
        public int SeatNumber { get; set; }
        public int xPosition { get; set; }
        public int yPosition { get; set; }

    }
    public class SeatDto
    {
        public int Id { get; set; }
        public int SeatTypeId { get; set; }
        public int RoomsId { get; set; }
        public bool isAvailable { get; set; }
        public string? Row { get; set; }
        public int SeatNumber { get; set; }
        public int xPosition { get; set; }
        public int yPosition { get; set; }

    }
    public class SeatConfiguration : IEntityTypeConfiguration<Seat>
    {
        public void Configure(EntityTypeBuilder<Seat> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.SeatTypeId).IsRequired();
            builder.Property(e => e.RoomsId).IsRequired();
            builder.Property(e => e.isAvailable).IsRequired();
            builder.Property(e => e.Row).IsRequired();
            builder.Property(e => e.SeatNumber).IsRequired();
            builder.Property(e => e.xPosition).IsRequired();
            builder.Property(e => e.yPosition).IsRequired();

        }
    }
}
