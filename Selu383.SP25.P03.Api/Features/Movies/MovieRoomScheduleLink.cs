using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Products;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MovieRoomScheduleLink : IEntity
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public int RoomId { get; set; }
        public int MovieId { get; set; }
        public int MovieScheduleId { get; set; }
    }
    public class MovieRoomScheduleLinkDto
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public int RoomId { get; set; }
        public int MovieId { get; set; }
        public int MovieScheduleId { get; set; }
    }
    public class MovieRoomScheduleLinkConfiguration : IEntityTypeConfiguration<MovieRoomScheduleLink>
    {
        public void Configure(EntityTypeBuilder<MovieRoomScheduleLink> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.TheaterId).IsRequired();
            builder.Property(x => x.RoomId).IsRequired();
            builder.Property(x => x.MovieId).IsRequired();
            builder.Property(x => x.MovieScheduleId).IsRequired();
        }
    }
}
