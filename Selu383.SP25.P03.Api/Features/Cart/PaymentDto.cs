using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class Payment : IEntity
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionStatus { get; set; }
        public DateTime ProcessedAt { get; set; }
    }
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? TransactionStatus { get; set; }
        public DateTime ProcessedAt { get; set; }
    }

    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(e => e.OrderId).IsRequired();
            builder.Property(e => e.PaymentMethod).IsRequired();
            builder.Property(e => e.TransactionStatus).IsRequired();
            builder.Property(e => e.ProcessedAt).IsRequired();

        }
    }


}
