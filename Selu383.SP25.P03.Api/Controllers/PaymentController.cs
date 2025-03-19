using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : GenericController<Payment, PaymentDto>
    {
        public PaymentController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

    }
}
