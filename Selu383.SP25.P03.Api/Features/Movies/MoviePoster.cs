

using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MoviePoster : IEntity
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required byte[] ImageData { get; set; }
        public string? ImageType { get; set; }
        public int MovieId { get; set; }
        public Movie? Movie { get; set; }
    }

    public class MoviePosterDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required byte[] ImageData { get; set; }
        public string? ImageType { get; set; }
        public int MovieId { get; set; }
    }

    public class MoviePosterConfiguration : IEntityTypeConfiguration<MoviePoster>
    {
        public void Configure(EntityTypeBuilder<MoviePoster> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).IsRequired();
            builder.HasOne(x => x.Movie)
                .WithMany()
                .HasForeignKey(x => x.MovieId);

        }
    }
}
