using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieScheduleController : GenericController<MovieSchedule, MovieScheduleDto>
    {
        public MovieScheduleController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

        // GET: api/MasterProductImage/GetByProductId/5
        [HttpGet("GetByMovieId/{movieId}")]
        public async Task<ActionResult<IEnumerable<MovieSchedule>>> GetByMovieId(int movieId)
        {
            var schedule = await _context.Set<MovieSchedule>()
                .Where(i => i.MovieId == movieId)
                .ToListAsync();

            return schedule;
        }
    }
}


