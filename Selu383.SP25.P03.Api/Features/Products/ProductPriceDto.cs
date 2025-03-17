using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Products
{
    public class ProductPrice : IEntity
    {
        public int Id { get; set; }
        public required int ProductId { get; set; }
        public required decimal Price { get; set; }
        public required DateOnly StartDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public DateOnly? EndDate { get; set; }
        public Product? Product { get; set; }

    }
    public class ProductPriceDto
    {
        public int Id { get; set; }
        public required int ProductId { get; set; }
        public required decimal Price { get; set; }
        public required DateOnly StartDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public DateOnly? EndDate { get; set; }

    }

    public class ProductPriceConfiguration : IEntityTypeConfiguration<ProductPrice>
    {
        public void Configure(EntityTypeBuilder<ProductPrice> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(e => e.ProductId);

            builder.Property(e => e.Price)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(e => e.StartDate).IsRequired();

            builder.Property(e => e.EndDate);

            builder.HasOne(x => x.Product)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction)
                .HasForeignKey(x => x.ProductId);
        }
    }
}
