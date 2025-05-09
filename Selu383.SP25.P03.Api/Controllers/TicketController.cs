﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Products;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class TicketController : GenericController<Ticket, TicketDto>
    {


        public TicketController(DataContext context, IMapper mapper)
            : base(context, mapper)        {

        }
        [HttpPost("create-tickets")]
        public async Task<IActionResult> CreateTickets([FromBody] CreateTicketsRequest request)
        {
            if (request.Seats == null || request.Seats.Count == 0)
            {
                return BadRequest("No seats provided");
            }

            
            var seatIds = request.Seats.Select(seat => seat.SeatId).ToList();

            var alreadyTakenSeats = await _context.Set<Ticket>()
                .Where(t => t.ScreeningId == request.ScreeningId && t.SeatId.HasValue && seatIds.Contains(t.SeatId.Value))

                .Select(t => t.SeatId)
                .ToListAsync();

            if (alreadyTakenSeats.Count > 0)
            {
                return BadRequest(new { message = "One or more seats are already taken.", seats = alreadyTakenSeats });
            }

           
            var tickets = request.Seats.Select(seat => new Ticket
            {
                OrderId = (int)request.OrderId,
                ScreeningId = request.ScreeningId,
                SeatId = seat.SeatId,
                TicketType = seat.SeatType,
                Price = seat.Price
            }).ToList();

            _context.Set<Ticket>().AddRange(tickets);
            await _context.SaveChangesAsync();

            var userTickets = tickets.Select(ticket => new UserTicket
            {
                UserId = request.UserId,
                TicketId = ticket.Id
            }).ToList();

            _context.Set<UserTicket>().AddRange(userTickets);
            await _context.SaveChangesAsync();

            return Ok(userTickets);
        }
        [HttpDelete("delete-by-order/{orderId}")]
        public async Task<IActionResult> DeleteTicketsByOrderId(long orderId)
        {
            
            var tickets = await _context.Set<Ticket>()
                .Where(t => t.OrderId == orderId)
                .ToListAsync();

            if (tickets == null || tickets.Count == 0)
            {
                return NotFound($"No tickets found for OrderId {orderId}");
            }

           
            var ticketIds = tickets.Select(t => t.Id).ToList();

            
            var userTickets = await _context.Set<UserTicket>()
                .Where(ut => ticketIds.Contains(ut.TicketId))
                .ToListAsync();

            _context.Set<UserTicket>().RemoveRange(userTickets);

            
            _context.Set<Ticket>().RemoveRange(tickets);

            
            await _context.SaveChangesAsync();

            return Ok(new { message = $"{tickets.Count} ticket(s) and related user-tickets deleted successfully." });
        }
    }
}
