using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Products
{
    
        public class ProductTypes : IEntity
        {
            public int Id { get; set; }
            public string? Name { get; set; }
            
        }
        public class ProductTypesDto
        {
            public int Id { get; set; }
            public string? Name { get; set; }
            
        }
        public class ProductTypesConfiguration : IEntityTypeConfiguration<ProductTypes>
        {
            public void Configure(EntityTypeBuilder<ProductTypes> builder)
            {
                builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).IsRequired();

            }
        }
    }

