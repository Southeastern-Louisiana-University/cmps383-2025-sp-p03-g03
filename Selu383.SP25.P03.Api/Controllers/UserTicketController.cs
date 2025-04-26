using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
        [AllowAnonymous]
        [HttpGet("GetByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<UserTicketDto>>> GetByUserId(int userId)
        {
            var userTickets = await _context.Set<UserTicket>()
                .Where(ut => ut.UserId == userId)
                .Include(ut => ut.Ticket) // <<< ADD THIS
                .ToListAsync();

            var result = userTickets.Select(ut => new UserTicketDto
            {
                Id = ut.Id,
                UserId = ut.UserId,
                TicketId = ut.TicketId,
                Ticket = ut.Ticket == null ? null : new TicketDto
                {
                    Id = ut.Ticket.Id,
                    OrderId = ut.Ticket.OrderId,
                    ScreeningId = ut.Ticket.ScreeningId,
                    SeatId = ut.Ticket.SeatId,
                    TicketType = ut.Ticket.TicketType,
                    Price = ut.Ticket.Price
                }
            }).ToList();

            return Ok(result);
        }


    }
}
