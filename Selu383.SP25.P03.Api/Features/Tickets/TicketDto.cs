using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;

namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class Ticket : IEntity
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ScreeningId { get; set; }
        public int? SeatId { get; set; }
        public string? TicketType { get; set; }
        public decimal Price { get; set; }
    }
    public class TicketDto
    {
        public int TicketId { get; set; }
        public int OrderId { get; set; }
        public int ScreeningId { get; set; }
        public int? SeatId { get; set; }
        public string? TicketType { get; set; }
        public decimal Price { get; set; }
    }

    public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
    {
        public void Configure(EntityTypeBuilder<Ticket> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(e => e.OrderId).IsRequired();
            builder.Property(e => e.ScreeningId).IsRequired();
            builder.Property(e => e.SeatId).IsRequired();
            builder.Property(e => e.TicketType)
                .HasColumnType("nvarchar(50)")
                .IsRequired();
            builder.Property(e => e.Price)
                .HasColumnType("decimal(18,2)")
                .IsRequired();
        }
    }
}
