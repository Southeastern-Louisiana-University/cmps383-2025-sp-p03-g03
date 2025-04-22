using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Seats;
using Microsoft.EntityFrameworkCore;

namespace Selu383.SP25.P03.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SeatController : GenericController<Seat, SeatDto>
    {
        public SeatController(DataContext context, IMapper mapper) : base(context, mapper)
        {
        }

        // GET: api/MasterProductImage/GetByProductId/5
        [HttpGet("GetByRoomId/{roomId}")]
        public async Task<ActionResult<IEnumerable<Seat>>> GetByRoomId(int roomId)
        {
            var images = await _context.Set<Seat>()

                .Where(i => i.RoomsId == roomId)
                .ToListAsync();


            return images;
        }
    }
}
