using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MovieSchedule : IEntity
    {
        public int Id { get; set; }
        
        public required DateTime[] MovieTimes { get; set; }
        public bool IsActive { get; set; }
    }
    public class MovieScheduleDto
    {
        public int Id { get; set; }

        public required DateTime[] MovieTimes { get; set; }
        public bool IsActive { get; set; }
    }
    public class MovieScheduleConfiguration : IEntityTypeConfiguration<MovieSchedule>
    {
        public void Configure(EntityTypeBuilder<MovieSchedule> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.MovieTimes).IsRequired();
            builder.Property(x => x.IsActive).IsRequired();
        }
    }
}
