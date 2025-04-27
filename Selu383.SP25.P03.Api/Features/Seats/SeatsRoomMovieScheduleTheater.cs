using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Seats
{
 
    public class SeatTaken : IEntity
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public int MovieScheduleId { get; set; }
        public int RoomsId { get; set; }
        public int SeatTypeId { get; set; }
        public bool IsTaken { get; set; }
    }

    public class SeatTakenDTO
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public int MovieScheduleId { get; set; }
        public int RoomsId { get; set; }
        public int SeatTypeId { get; set; }
        public bool IsTaken { get; set; }
    }

    public class SeatTakenConfiguration : IEntityTypeConfiguration<SeatTaken>
    {
        public void Configure(EntityTypeBuilder<SeatTaken> builder)
        {
            
            builder.Property(e => e.TheaterId).IsRequired();
            builder.Property(e => e.MovieScheduleId).IsRequired();
            builder.Property(e => e.SeatTypeId).IsRequired();
            builder.Property(e => e.RoomsId).IsRequired();
            builder.Property(e => e.IsTaken).IsRequired();

        }
    }
    
}
