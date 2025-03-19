using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemController : GenericController<CartItem, CartItemDto>
    {
        public CartItemController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

    }
}
