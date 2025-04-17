using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Rooms;
using Microsoft.EntityFrameworkCore;


namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : GenericController<Room, RoomDto   >
    {
        public RoomController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

        // GET: api/MasterProductImage/GetByProductId/5
        [HttpGet("GetByMovieId/{theaterId}")]
        public async Task<ActionResult<IEnumerable<Room>>> GetRoomByTheaterId(int theaterId)
        {
            var room = await _context.Set<Room>()
                .Where(i => i.TheaterId == theaterId)
                .ToListAsync();

            return room;
        }



    }



}
