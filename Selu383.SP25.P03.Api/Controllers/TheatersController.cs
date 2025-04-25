using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using Stripe;
using System;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/theaters")]
    [ApiController]
    public class TheatersController : ControllerBase
    {
        private readonly DbSet<Theater> theaters;
        private readonly DataContext dataContext;
        private readonly DbSet<User> users;
        private readonly UserManager<User> userManager;

        public TheatersController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            theaters = dataContext.Set<Theater>();
            users = dataContext.Set<User>();
            this.userManager = userManager;
        }

        [HttpGet]
        public IQueryable<TheaterDto> GetAllTheaters()
        {
            return GetTheaterDtos(theaters);
        }

        [HttpGet]
        [Route("Active")]
        public IQueryable<TheaterDto> GetActiveTheaters()
        {
            return GetTheaterDtos(theaters.Where(x => x.Active == true)); 
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<TheaterDto> GetTheaterById(int id)
        {
            var result = GetTheaterDtos(theaters.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        //[Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<TheaterDto> CreateTheater(TheaterDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var theater = new Theater
            {
                Name = dto.Name,
                Address1 = dto.Address1,
                Address2 = dto.Address2,
                City = dto.City,
                State = dto.State,
                Zip = dto.Zip,
                Phone1 = dto.Phone1,
                Phone2 = dto.Phone2,
                Active = dto.Active,
                ManagerId = dto.ManagerId,

            };
            theaters.Add(theater);

            dataContext.SaveChanges();

            dto.Id = theater.Id;

            return CreatedAtAction(nameof(GetTheaterById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        //[Authorize]
        public async Task<ActionResult<TheaterDto>> UpdateTheater(int id, TheaterDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var currentUser = await userManager.GetUserAsync(User);

            if (currentUser == null)
            {
                return Forbid();
            }

            if (!User.IsInRole(UserRoleNames.Admin) && currentUser.Id != dto.ManagerId)
            {
                return Forbid();
            }

            var theater = theaters.FirstOrDefault(x => x.Id == id);
            if (theater == null)
            {
                return NotFound();
            }

            theater.Id = dto.Id;
            theater.Name = dto.Name;
            theater.Address1 = dto.Address1;
            theater.Address2 = dto.Address2;
            theater.City = dto.City;
            theater.State = dto.State;
            theater.Zip = dto.Zip;
            theater.Phone1 = dto.Phone1;
            theater.Phone2 = dto.Phone2;
            theater.Active = dto.Active;
            theater.ManagerId = dto.ManagerId;

            if (User.IsInRole(UserRoleNames.Admin))
            {
                theater.ManagerId = dto.ManagerId;
            }

            dataContext.SaveChanges();

            dto.Id = theater.Id;
            dto.ManagerId = theater.ManagerId;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        //[Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteTheater(int id)
        {
            var theater = theaters.FirstOrDefault(x => x.Id == id);
            if (theater == null)
            {
                return NotFound();
            }

            theaters.Remove(theater);

            dataContext.SaveChanges();

            return Ok();
        
        }

        private bool IsInvalid(TheaterDto dto)
        {
            return string.IsNullOrWhiteSpace(dto.Name) ||
                   dto.Name.Length > 120 ||
                   string.IsNullOrWhiteSpace(dto.Address1) ||
                   //dto.SeatCount <= 0 ||
                   dto.ManagerId != null && !users.Any(x => x.Id == dto.ManagerId);
        }

        private static IQueryable<TheaterDto> GetTheaterDtos(IQueryable<Theater> theaters)
        {
            return theaters
                .Select(x => new TheaterDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Address1 = x.Address1,
                    Address2 = x.Address2,
                    City = x.City,
                    State = x.State,
                    Zip = x.Zip,
                    Phone1 = x.Phone1,
                    Phone2 = x.Phone2,
                    Active = x.Active,
                    ManagerId = x.ManagerId
                });
        }
    }
}
