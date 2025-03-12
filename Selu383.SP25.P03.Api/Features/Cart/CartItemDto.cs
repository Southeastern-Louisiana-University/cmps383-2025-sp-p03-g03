using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class CartItem // : IEntity //an individual itemin the shopping cart
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int ScreeningId { get; set; } // for assigning seats
        public int? SeatId { get; set; }
        public string TicketType { get; set; }
        public decimal Price { get; set; } 
        public int Quantity { get; set; }
    }

    public class CartItemDto //an individual itemin the shopping cart
    {
        public int Id { get; set; }

        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
