using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserTicketController : GenericController<UserTicket, UserTicketController>
    {
        public UserTicketController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }
        [HttpGet("GetByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<UserTicket>>> GetByUserId(int userId)
        {
            var userTickets = await _context.Set<UserTicket>()
                .Where(ut => ut.UserId == userId)
                .ToListAsync();

            return userTickets;
        }


    }
}
