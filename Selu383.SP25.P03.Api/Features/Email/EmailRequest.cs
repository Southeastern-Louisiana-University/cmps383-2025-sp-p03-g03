namespace Selu383.SP25.P03.Api.Features.Email
{
    public class EmailRequest
    {
        public string RecipientEmail { get; set; } = string.Empty;
        public string MovieTitle { get; set; } = string.Empty;
        public string Showtime { get; set; } = string.Empty;
        public string Seats { get; set; } = string.Empty;
        public string Concessions { get; set; } = string.Empty;
    }
}
