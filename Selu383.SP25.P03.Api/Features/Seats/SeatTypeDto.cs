
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class SeatType :IEntity
    {
        public int Id { get; set; }
        public string? SeatTypes { get; set; }
    }

    public class SeatTypeDto
    {
        public int Id { get; set; }
        public string? SeatTypes { get; set; }
    }
}
