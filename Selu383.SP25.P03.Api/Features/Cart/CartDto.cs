namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class CartDto //shopping cart - holds ticket selections
    {
        public int CartId { get; set; }
        public int? UserId { get; set; }
        public string? SessionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        // Include the cart items for a complete view.
        public List<CartItemDto>? Items { get; set; }
    }
}
