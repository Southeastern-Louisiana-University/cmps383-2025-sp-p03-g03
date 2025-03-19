﻿using AutoMapper;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Products;
using Selu383.SP25.P03.Api.Features.Promos;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Data
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //Cart
            CreateMap<Cart, CartDto>();
            CreateMap<CartDto, Cart>();

            //CartItem
            CreateMap<CartItem, CartItemDto>();
            CreateMap<CartItemDto, CartItem>();

            //Movie
            CreateMap<Movie, MovieDto>();
            CreateMap<MovieDto, Movie>();

            //MovieSchedule
            CreateMap<MovieSchedule, MovieScheduleDto>();
            CreateMap<MovieScheduleDto, MovieSchedule>();

            //MovieRoomScheduleLink
            CreateMap<MovieRoomScheduleLink, MovieRoomScheduleLinkDto>();
            CreateMap<MovieRoomScheduleLinkDto, MovieRoomScheduleLink>();

            //Product
            CreateMap<Product, ProductDto>();
            CreateMap<ProductDto, Product>();

            //ProductPrice
            CreateMap<ProductPrice, ProductPriceDto>();
            CreateMap<ProductPriceDto, ProductPrice>();

            //Promo
            CreateMap<Promo, PromoDto>();
            CreateMap<PromoDto, Promo>();

            //PromoSchedule
            CreateMap<PromoSchedule, PromoScheduleDto>();
            CreateMap<PromoScheduleDto, PromoSchedule>();

            //Seat
            CreateMap<Seat, SeatDto>();
            CreateMap<SeatDto, Seat>();

            //SeatType
            CreateMap<SeatType, SeatTypeDto>();
            CreateMap<SeatTypeDto, SeatType>();

            //Theater
            CreateMap<Theater, TheaterDto>();
            CreateMap<TheaterDto, Theater>();

            //Ticket
            CreateMap<Ticket, TicketDto>();
            CreateMap<TicketDto, Ticket>();

            //MoviePoster
            CreateMap<MoviePoster, MoviePosterDto>();
            CreateMap<MoviePosterDto, MoviePoster>();

        }
    }
}
//I added packages?