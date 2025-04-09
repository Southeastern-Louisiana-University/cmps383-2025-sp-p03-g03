using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Features.Email;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Selu383.SP25.P03.Api.Features.Emails
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public EmailController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _configuration = configuration;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest emailRequest)
        {
            var apiKey = _configuration["Smtp2Go:ApiKey"];
            var senderEmail = _configuration["Smtp2Go:Sender"];

            var payload = new
            {
                sender = senderEmail,
                to = new[] { emailRequest.RecipientEmail },
                subject = emailRequest.Subject,
                text_body = emailRequest.TextBody
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.smtp2go.com/v3/email/send")
            {
                Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
            };

            request.Headers.Add("X-Smtp2go-Api-Key", apiKey);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, error);
            }

            return Ok("Email sent successfully.");
        }
    }
}
