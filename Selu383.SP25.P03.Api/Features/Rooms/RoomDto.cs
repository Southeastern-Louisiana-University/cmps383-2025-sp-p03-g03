using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Rooms
{
    public class Room : IEntity
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int NumOfSeats { get; set; }
        public int rows { get; set; }
        public int columns { get; set; }
        public string? ScreenType { get; set; }
        public string? Audio { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsPremium { get; set; } = false;
        public int TimeToClean { get; set; }
        public int TheaterId { get; set; }
        public Theater? Theaters { get; set; }
    }
    public class RoomDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int NumOfSeats { get; set; }
        public int rows { get; set; }
        public int columns { get; set; }
        public string? ScreenType { get; set; }
        public string? Audio { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsPremium { get; set; } = false;
        public int TimeToClean { get; set; }
        public int TheaterId { get; set; }
    }
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Name).IsRequired(false);
            builder.Property(e => e.NumOfSeats).IsRequired();
            builder.Property(e => e.rows).IsRequired();
            builder.Property(e => e.columns).IsRequired();
            builder.Property(e => e.ScreenType).IsRequired(false);
            builder.Property(e => e.Audio).IsRequired(false);
            builder.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .IsRequired();
            builder.Property(e => e.IsPremium)
                .HasDefaultValue(false);
                

            builder.Property(e => e.TimeToClean).IsRequired();
            builder.Property(e => e.TheaterId).IsRequired();

            //builder.HasOne(e => e.Theaters)
            //    .WithMany()
            //    .HasForeignKey(e => e.TheaterId);   

        }
    }
}
