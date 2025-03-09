namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MovieScheduleDto
    {
        public int Id { get; set; }
        
        public required DateTime[] MovieTimes { get; set; }
        public bool IsActive { get; set; }
    }
}
