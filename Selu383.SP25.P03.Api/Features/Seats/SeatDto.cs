namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class SeatDto
    {
        public int Id { get; set; }
        public int SeatTypeId { get; set; }
        public int RoomsId { get; set; }
        public bool isAvailable { get; set; }
        public string Row { get; set; }
        public int SeatNumber { get; set; }
        public int xPosition { get; set; }
        public int yPosition { get; set; }

    }
}
