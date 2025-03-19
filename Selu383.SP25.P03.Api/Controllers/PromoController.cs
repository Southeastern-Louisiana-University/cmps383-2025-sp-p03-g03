using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Promos;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromoController : GenericController<Promo, PromoDto>
    {
        public PromoController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

    }
}
