using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;
using Selu383.SP25.P03.Api.Features.Products;

namespace Selu383.SP25.P03.Api.Features.Products
{
    
        public class ProductType : IEntity
        {
            public int Id { get; set; }
            public required string Name { get; set; }
             //public Product? Products { get; set; }
            
        }
        public class ProductTypeDto
        {
            public int Id { get; set; }
            public required string Name { get; set; }
            
        }
        public class ProductTypesConfiguration : IEntityTypeConfiguration<ProductType>
        {
            public void Configure(EntityTypeBuilder<ProductType> builder)
            {
                builder.HasKey(x => x.Id);

                builder.Property(x => x.Name).IsRequired();

            //builder.HasOne(e => e.Products)
            //    .WithMany()
            //    .HasForeignKey(e => e.Id);

            }
        }
    }

