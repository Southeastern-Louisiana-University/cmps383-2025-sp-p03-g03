namespace Selu383.SP25.P03.Api.Features.Promos
{
    public class PromoScheduleDto
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsActive { get; set; }
    }
}
