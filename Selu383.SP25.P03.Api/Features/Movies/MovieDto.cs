namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MovieDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public int Runtime { get; set; }
        public bool IsActive { get; set; }
        public string? AgeRating { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}
