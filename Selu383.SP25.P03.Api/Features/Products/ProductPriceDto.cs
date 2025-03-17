using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Products
{
    public class ProductPrice : IEntity
    {
        public int Id { get; set; }
        public int ProductId { get; set; }

    }
    public class ProductPriceDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }

    }

    public class ProductPriceConfiguration : IEntityTypeConfiguration<ProductPrice>
    {
        public void Configure(EntityTypeBuilder<ProductPrice> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(e => e.ProductId);
        }
    }
}
