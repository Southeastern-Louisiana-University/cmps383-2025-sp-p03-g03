namespace Selu383.SP25.P03.Api.Features.Rooms
{
    public class RoomDto
    {
        int Id { get; set; }
        public string Name { get; set; }
        public int NumOfSeats { get; set; }
        public int rows { get; set; }
        public int columns { get; set; }
        public string ScreenType { get; set; }
        public string Audio { get; set; }
        public bool IsActive { get; set; }
        public int TimeToClean { get; set; }
    }
}
