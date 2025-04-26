namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class CreateTicketsRequest
    {
        public int UserId { get; set; }
        public int OrderId { get; set; }
        public int ScreeningId { get; set; }
        public List<SeatInfo> Seats { get; set; } = new();
    }

    public class SeatInfo
    {
        public int SeatId { get; set; }
        public string TicketType { get; set; } = string.Empty;
        public string SeatType { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
