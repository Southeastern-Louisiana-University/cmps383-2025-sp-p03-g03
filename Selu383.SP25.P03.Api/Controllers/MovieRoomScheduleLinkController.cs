using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Controllers
{ 
    [Route("api/[controller]")]
    [ApiController]
    public class MovieRoomScheduleLinkController : GenericController<MovieRoomScheduleLink, MovieRoomScheduleLinkDto>
    {
        public MovieRoomScheduleLinkController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

        [HttpGet("GetByScheduleId/{scheduleId}")]
        public async Task<ActionResult<IEnumerable<MovieRoomScheduleLink>>> GetByScheduleId(int scheduleId)
        {
            var schedule = await _context.Set<MovieRoomScheduleLink>()

                .Where(i => i.MovieScheduleId == scheduleId)
                .ToListAsync();


            return schedule;
        }


    }

}
