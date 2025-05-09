﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviePosterController : GenericController<MoviePoster, MoviePosterDto>
    {
        public MoviePosterController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

        // GET: api/MasterProductImage/GetByProductId/5
        [HttpGet("GetByMovieId/{movieId}")]
        public async Task<ActionResult<IEnumerable<MoviePoster>>> GetByMovieId(int movieId)
        {
            var images = await _context.Set<MoviePoster>()

                .Where(i => i.MovieId == movieId)
                .ToListAsync();


            return images;
        }

        //GET: images so frontend <image> tag can be use it
        [HttpGet("{id}/image")]
        public async Task<IActionResult> GetImage(int id)
        {
            var poster = await _context.Set<MoviePoster>().FindAsync(id);
            if (poster == null || poster.ImageData == null)
            {
                return NotFound();
            }
            return File(poster.ImageData, poster.ImageType ?? "image/jpeg");
        }
    }

 }