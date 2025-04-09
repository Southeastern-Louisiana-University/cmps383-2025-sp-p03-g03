using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class RoomSeatsController : GenericController<RoomSeats, RoomSeatsDto>
    {
        public RoomSeatsController(DataContext context, IMapper mapper) : base(context, mapper)
        { 
        }
    }
}
