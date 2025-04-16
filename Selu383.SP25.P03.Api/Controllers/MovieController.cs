using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : GenericController<Movie, MovieDto>
    {
        public MovieController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }
        [AllowAnonymous]
        public override Task<ActionResult<IEnumerable<MovieDto>>> GetAll()
        {
            return base.GetAll();
        }
        [AllowAnonymous]
        public override Task<ActionResult<MovieDto>> GetById(int id)
        {
            return base.GetById(id);
        }
    }
}
