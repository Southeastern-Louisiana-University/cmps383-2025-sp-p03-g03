namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? TransactionStatus { get; set; }
        public DateTime ProcessedAt { get; set; }
    }
}
