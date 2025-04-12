using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Products;
using Microsoft.EntityFrameworkCore;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : GenericController<Product, ProductDto>
    {
        private readonly DataContext _context;
        public ProductController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
            _context = context;
        }
        [HttpGet]
        public override async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            var products = await _context.Products
            .Include(p => p.ProductType)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                IsActive = p.IsActive,
                TheaterId = p.TheaterId,
                ProductTypeId = p.ProductTypeId,
                ProductType = p.ProductType.Name
            })
            .ToListAsync();

            return Ok(products);
        }

    }
}
