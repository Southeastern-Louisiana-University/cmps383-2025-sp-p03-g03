using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : GenericController<Ticket, TicketDto>
    {
        public TicketController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

    }
}
