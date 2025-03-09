using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class SeatType : IEntity
    {
        public int Id { get; set; }
        public string Type { get; set; }
    }
    public class SeatTypeDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
    }
    public class SeatTypeConfiguration : IEntityTypeConfiguration<SeatType>
    {
        public void Configure(EntityTypeBuilder<SeatType> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Type).IsRequired();
        }
    }
}
