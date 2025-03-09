namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MovieRoomScheduleLink
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public int RoomId { get; set; }
        public int MovieId { get; set; }
        public int MovieScheduleId { get; set; }
    }
}
