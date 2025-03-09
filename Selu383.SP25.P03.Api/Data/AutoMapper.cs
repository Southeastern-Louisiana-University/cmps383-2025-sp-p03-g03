using AutoMapper;
using Selu383.SP25.P03.Api.Features.Cart;

namespace Selu383.SP25.P03.Api.Data
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //Cart
            CreateMap<Cart, CartDto>();
            CreateMap<CartDto, Cart>();

            ////CartItem
            //CreateMap<CartItem, CartItemDto>();
            //CreateMap<CartItemDto, CartItem>();
        }
    }
}
