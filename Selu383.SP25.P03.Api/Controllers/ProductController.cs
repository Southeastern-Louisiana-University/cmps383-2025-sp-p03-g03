using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Products;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : GenericController<Product, ProductDto>
    {
        public ProductController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

        [HttpGet]
        public override async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            var products = await _context.Set<Product>()
            .Include(p => p.ProductType)
            .Select(p => new Product
            {
                Id = p.Id,
                Name = p.Name,
                IsActive = p.IsActive,
                ProductTypeId = p.ProductTypeId,
                ImageData = p.ImageData,
                ImageType = p.ImageType,
                ProductType = new ProductType
                {
                    Id = p.ProductType.Id,
                    Name = p.ProductType.Name
                }
            })
            .ToListAsync();

            return Ok(products);
        }


    }




    }

