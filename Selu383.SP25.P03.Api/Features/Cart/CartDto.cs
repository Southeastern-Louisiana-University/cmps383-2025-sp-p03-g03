using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Cart

{


    public class Cart : IEntity
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string SessionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        // Include the cart items for a complete view.
        public List<CartItemDto> Items { get; set; }
    }

    public class CartDto //shopping cart - holds ticket selections
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string SessionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        // Include the cart items for a complete view.
        public List<CartItemDto> Items { get; set; }
    }

    public class CartConfiguration : IEntityTypeConfiguration<Cart>
    {
        public void Configure(EntityTypeBuilder<Cart> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.CreatedAt).IsRequired();
            builder.Property(e => e.UpdatedAt).IsRequired();
            //builder.HasMany(e => e.Items).WithOne().HasForeignKey("CartId");
        }
    }
}

