using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Products;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class TicketController : GenericController<Ticket, TicketDto>
    {
        private readonly DataContext _context; // Fix for IDE0290: Use explicit field instead of primary constructor
        private readonly IMapper _mapper;

        public TicketController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
            _context = context; // Explicitly assign to the private field
            _mapper = mapper;
        }

        [HttpPost("create-tickets")]
        public async Task<IActionResult> CreateTickets([FromBody] CreateTicketsRequest request)
        {
            if (request.Seats == null || request.Seats.Count == 0)
            {
                return BadRequest("No seats provided");
            }

            var tickets = new List<Ticket>();
            var userTickets = new List<UserTicket>();

            foreach (var seat in request.Seats)
            {
                var ticket = new Ticket
                {
                    OrderId = request.OrderId, // you could generate or reuse an Order entity later
                    ScreeningId = request.ScreeningId,
                    SeatId = seat.SeatId,
                    TicketType = seat.SeatType, // ex: "Adult", "Child", etc
                    Price = seat.Price
                };
                _context.Set<Ticket>().Add(ticket); // Fix for CS1061: Use Set<T>() to access DbSet
                tickets.Add(ticket);
            }

            await _context.SaveChangesAsync(); // Save the Tickets first so they get IDs

            foreach (var ticket in tickets)
            {
                var userTicket = new UserTicket
                {
                    UserId = request.UserId,
                    TicketId = ticket.Id
                };
                _context.Set<UserTicket>().Add(userTicket); // Fix for CS1061: Use Set<T>() to access DbSet
                userTickets.Add(userTicket);
            }

            await _context.SaveChangesAsync(); // Save UserTickets

            return Ok(userTickets);
        }
    }
}
