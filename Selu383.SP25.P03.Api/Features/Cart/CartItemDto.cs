<<<<<<< HEAD
﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class CartItem : IEntity //an individual itemin the shopping cart
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int ScreeningId { get; set; } // for assigning seats
        public int? SeatId { get; set; }
        public string TicketType { get; set; }
        public decimal Price { get; set; } 
        public int Quantity { get; set; }
    }

    public class CartItemDto //an individual itemin the shopping cart
    {
        public int Id { get; set; }
=======
﻿namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class CartItemDto //an individual itemin the shopping cart
    {
        public int CartItemId { get; set; }
>>>>>>> d9ade984211b2b251f742811013d3fad56904ff4
        public int CartId { get; set; }
        public int ScreeningId { get; set; } // for assigning seats
        public int? SeatId { get; set; }
        public string TicketType { get; set; }
<<<<<<< HEAD
        //public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

    public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.CartId).IsRequired();
            builder.Property(e => e.ScreeningId).IsRequired();
            builder.Property(e => e.TicketType).IsRequired();
            //builder.Property(e => e.Price)
            //    .HasColumnType("decimal(18,2)")
            //    .IsRequired();
            builder.Property(e => e.Quantity).IsRequired();
        }

    }
}

=======
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
>>>>>>> d9ade984211b2b251f742811013d3fad56904ff4
