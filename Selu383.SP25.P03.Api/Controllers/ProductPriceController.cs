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
    [AllowAnonymous]
    public class ProductPriceController : GenericController<ProductPrice, ProductPriceDto>
    {
        public ProductPriceController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }
        [AllowAnonymous]
        public override Task<ActionResult<IEnumerable<ProductPriceDto>>> GetAll()
        {
            return base.GetAll();
        }
        public override Task<ActionResult<ProductPriceDto>> Create(ProductPriceDto dto)
        {
            return base.Create(dto);
        }
    }
}
