using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Products;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductTypesController : GenericController<ProductType, ProductTypeDto>
    {
        public ProductTypesController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }
        [AllowAnonymous]
        public override Task<ActionResult<IEnumerable<ProductTypeDto>>> GetAll()
        {
            return base.GetAll();
        }

    }
}
