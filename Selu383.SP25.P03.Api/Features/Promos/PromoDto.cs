using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Features.Promos
{
    public class Promo : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SchedulePromoId { get; set; }
    }
    public class PromoDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SchedulePromoId { get; set; }
    }
    public class PromoConfiguration : IEntityTypeConfiguration<Promo>
    {
        public void Configure(EntityTypeBuilder<Promo> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).IsRequired();
            builder.Property(x => x.Description).IsRequired();
            builder.Property(x => x.SchedulePromoId).IsRequired();
        }
    }
}
