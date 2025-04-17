using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class Movie : IEntity
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public int Runtime { get; set; }
        public bool IsActive { get; set; } = true;
        public string? AgeRating { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string? PreviewURL { get; set; }
    }
    public class MovieDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public int Runtime { get; set; }
        public bool IsActive { get; set; } = true;
        public string? AgeRating { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string? PreviewURL { get; set; }
    }
    public class MovieConfiguration : IEntityTypeConfiguration<Movie>
    {
        public void Configure(EntityTypeBuilder<Movie> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Title).IsRequired();
            builder.Property(x => x.Description).IsRequired();
            builder.Property(x => x.Category).IsRequired();
            builder.Property(x => x.Runtime).IsRequired();
            builder.Property(x => x.IsActive)
                .HasDefaultValue(true)
                .IsRequired();
            builder.Property(x => x.AgeRating).IsRequired();
            builder.Property(x => x.ReleaseDate).IsRequired();
        }
    }
}
