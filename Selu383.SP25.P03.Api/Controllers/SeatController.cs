using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public SeatController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Seat/room/5
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<IEnumerable<SeatDto>>> GetSeatsByRoom(int roomId)
        {
            var seats = await _context.Seats
                .Where(s => s.RoomsId == roomId)
                .OrderBy(s => s.Row)
                .ThenBy(s => s.SeatNumber)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<SeatDto>>(seats));
        }
    }
}