using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Rooms;

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

    }
}
