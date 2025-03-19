using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Promos
{
    public class PromoSchedule : IEntity
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsActive { get; set; }
    }
    public class PromoScheduleDto
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsActive { get; set; }
    }
    public class PromoScheduleConfiguration : IEntityTypeConfiguration<PromoSchedule>
    {
        public void Configure(EntityTypeBuilder<PromoSchedule> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.StartTime).IsRequired();
            builder.Property(e => e.EndTime).IsRequired();
            builder.Property(e => e.IsActive).IsRequired();

        }
    }
}
