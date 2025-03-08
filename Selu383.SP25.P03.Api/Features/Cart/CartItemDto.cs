namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class CartItemDto //an individual itemin the shopping cart
    {
        public int CartItemId { get; set; }
        public int CartId { get; set; }
        public int ScreeningId { get; set; } // for assigning seats
        public int? SeatId { get; set; }
        public string TicketType { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
