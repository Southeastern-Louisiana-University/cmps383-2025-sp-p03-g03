namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class TicketDto
    {
        public int TicketId { get; set; }
        public int OrderId { get; set; }
        public int ScreeningId { get; set; }
        public int? SeatId { get; set; }
        public string? TicketType { get; set; }
        public decimal Price { get; set; }
    }
}
