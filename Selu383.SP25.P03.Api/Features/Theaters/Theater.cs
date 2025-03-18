using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Theater 
    {
        public int Id { get; set; }
        public required bool Active { get; set; } = true;
        public required string Name { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public int? ManagerId { get; set; }
        public virtual User? Manager { get; set; }
    }

    public class TheaterDto
    {
        public int Id { get; set; }
        public required bool Active { get; set; } = true;
        public required string Name { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public int? ManagerId { get; set; }    
    }

}

public class TheaterConfiguration : IEntityTypeConfiguration<Theater>
{
    public void Configure(EntityTypeBuilder<Theater> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Active).IsRequired();
        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Address1);
        builder.Property(e => e.Address2);
        builder.Property(e => e.City);
        builder.Property(e => e.State);
        builder.Property(e => e.Zip);
        builder.Property(e => e.Phone1);
        builder.Property(e => e.Phone2);
        builder.Property(e => e.ManagerId);
        
        //builder.HasOne(e => e.Manager)
        //    .WithMany()
        //    .OnDelete(DeleteBehavior.NoAction)
        //    .HasForeignKey(e => e.ManagerId);

    }
}
