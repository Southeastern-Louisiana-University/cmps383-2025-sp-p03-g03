using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

[ApiController]
[Route("api/stripe")]
public class StripeController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public StripeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("create-session")]
    public IActionResult CreateCheckoutSession([FromBody] CreateCheckoutRequest request)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new()
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)(request.Amount * 100),
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = request.Description
                        }
                    },
                    Quantity = 1
                }
            },
            Mode = "payment",
            SuccessUrl = request.SuccessUrl,
            CancelUrl = request.CancelUrl,
        };

        var service = new SessionService();
        Session session = service.Create(options);

        return Ok(new { sessionId = session.Id });
    }

    [HttpGet("public-key")]
    public IActionResult GetPublicKey()
    {
        var publicKey = _configuration["Stripe:PublishableKey"];
        return Ok(new { publicKey });
    }
}

public class CreateCheckoutRequest
{
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string? SuccessUrl { get; set; }
    public string? CancelUrl { get; set; }
}
