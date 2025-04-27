using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class TicketDetails : IEntity
    {
        public int Id { get; set; }
        public string TheaterName { get; set; } = string.Empty;
        public string? MovieName { get; set; } = string.Empty;
        public DateTime MovieTime { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public string SeatName { get; set; } = string.Empty;
        public string? TicketType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int ScreeningId { get; set; }
        public int UserId { get; set; }
    }

    public class TicketDetailsDto
    {
        public int Id { get; set; }
        public string TheaterName { get; set; } = string.Empty;
        public string? MovieName { get; set; } = string.Empty;
        public DateTime MovieTime { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public string SeatName { get; set; } = string.Empty;
        public string? TicketType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int ScreeningId { get; set; }
        public int UserId { get; set; }
    }
}
