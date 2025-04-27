using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Rooms;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Tickets;
using System.Linq;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class TicketDetailsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public TicketDetailsController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/TicketDetails
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<TicketDetailsDto>>> GetAllTicketDetails()
        {
            var ticketDetails = await GetTicketDetailsQuery().ToListAsync();
            return Ok(ticketDetails);
        }

        // GET: api/TicketDetails/user/5
        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<TicketDetailsDto>>> GetTicketDetailsByUser(int userId)
        {
            var ticketDetails = await GetTicketDetailsQuery()
                .Where(td => td.UserId == userId)
                .ToListAsync();

            return Ok(ticketDetails);
        }

        // GET: api/TicketDetails/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<TicketDetailsDto>> GetTicketDetailsById(int id)
        {
            var ticketDetails = await GetTicketDetailsQuery()
                .FirstOrDefaultAsync(td => td.Id == id);

            if (ticketDetails == null)
            {
                return NotFound();
            }

            return Ok(ticketDetails);
        }

        // GET: api/TicketDetails/screening/5
        [HttpGet("screening/{screeningId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<TicketDetailsDto>>> GetTicketDetailsByScreening(int screeningId)
        {
            var ticketDetails = await GetTicketDetailsQuery()
                .Where(td => td.ScreeningId == screeningId)
                .ToListAsync();

            return Ok(ticketDetails);
        }

        private IQueryable<TicketDetailsDto> GetTicketDetailsQuery()
        {
            return from userTicket in _context.Set<UserTicket>()
                   join ticket in _context.Set<Ticket>() on userTicket.TicketId equals ticket.Id
                   join seat in _context.Set<Seat>() on ticket.SeatId equals seat.Id into seatJoin
                   from seat in seatJoin.DefaultIfEmpty()
                   join movieSchedule in _context.Set<MovieSchedule>() on ticket.ScreeningId equals movieSchedule.Id into scheduleJoin
                   from movieSchedule in scheduleJoin.DefaultIfEmpty()
                   join movie in _context.Set<Movie>()
                        on (movieSchedule == null || !movieSchedule.MovieId.HasValue)
                            ? -1 // Use an invalid ID for null cases
                            : movieSchedule.MovieId.Value
                        equals movie.Id into movieJoin
                   from movie in movieJoin.DefaultIfEmpty()
                   join room in _context.Set<Room>()
                        on (seat == null) ? -1 : seat.RoomsId
                        equals room.Id into roomJoin
                   from room in roomJoin.DefaultIfEmpty()
                   join theater in _context.Set<Theater>()
                        on (room == null) ? -1 : room.TheaterId
                        equals theater.Id into theaterJoin
                   from theater in theaterJoin.DefaultIfEmpty()
                   select new TicketDetailsDto
                   {
                       Id = ticket.Id,
                       TheaterName = theater == null ? string.Empty : (theater.Name == null ? string.Empty : theater.Name),
                       MovieName = movie == null ? string.Empty : (movie.Title == null ? string.Empty : movie.Title),
                       // For MovieTimes, use a safe approach
                       MovieTime = (movieSchedule == null || movieSchedule.MovieTimes == null || movieSchedule.MovieTimes.Length == 0)
                           ? DateTime.MinValue
                           : movieSchedule.MovieTimes[0],
                       RoomName = room == null ? string.Empty : (room.Name == null ? string.Empty : room.Name),
                       SeatName = seat == null ? string.Empty : ((seat.Row == null ? string.Empty : seat.Row) + seat.SeatNumber.ToString()),
                       TicketType = ticket.TicketType == null ? string.Empty : ticket.TicketType,
                       Price = ticket.Price,
                       ScreeningId = ticket.ScreeningId,
                       UserId = userTicket.UserId
                   };
        }
    }
}