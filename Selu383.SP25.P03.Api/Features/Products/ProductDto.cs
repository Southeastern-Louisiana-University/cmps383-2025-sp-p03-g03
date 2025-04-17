using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Products
{
    public class Product : IEntity
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public bool IsActive { get; set; }
        public required byte[] ImageData { get; set; }
        public string? ImageType { get; set; }
        public int ProductTypeId { get; set; }
        public required ProductType ProductType { get; set; } // singular
    }
    public class ProductDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public bool IsActive { get; set; }
        public required byte[] ImageData { get; set; }
        public string? ImageType { get; set; }
        public int ProductTypeId { get; set; }
        //public required ProductType ProductType { get; set; }

    }
    public class CartConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Name).IsRequired();
            builder.Property(e => e.IsActive).IsRequired();

            builder.HasOne(e => e.ProductType)
                .WithMany()
                .HasForeignKey(e => e.ProductTypeId);

        }
    }
}
