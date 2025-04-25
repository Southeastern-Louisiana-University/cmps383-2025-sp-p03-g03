using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly DataContext dataContext;
        private DbSet<Role> roles;

        public UsersController(
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            DataContext dataContext)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.dataContext = dataContext;
            roles = dataContext.Set<Role>();
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            if (dto.Roles == null || dto.Roles.Length == 0 || !dto.Roles.All(x => roles.Any(y => x == y.Name)))
            {
                return BadRequest();
            }

            var result = await userManager.CreateAsync(new User { UserName = dto.Username }, dto.Password);
            if (result.Succeeded)
            {
                var user = await userManager.FindByNameAsync(dto.Username);
                if (user == null)
                {
                    return BadRequest();
                }

                await userManager.AddToRolesAsync(user, dto.Roles);

                return new UserDto
                {
                    Id = user.Id,
                    UserName = dto.Username,
                    Roles = dto.Roles
                };
            }
            return BadRequest();
        }

        [HttpGet("current")]
        //[Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return new UserDto
                {
                    Id = 0,
                    UserName = "Not authenticated",
                    Roles = Array.Empty<string>()
                };
            }

            var roles = await userManager.GetRolesAsync(user);
            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = roles.ToArray()
            });
        }

        [HttpGet]
        //[Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            // Get all users from the database
            var users = await userManager.Users.ToListAsync();

            // Create a list to hold all user DTOs
            var userDtos = new List<UserDto>();

            // Process each user to create a DTO with roles
            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);

                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Roles = roles.ToArray()
                });
            }

            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<UserDto>> GetById(int id)
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound($"User with ID {id} not found");
            }

            var roles = await userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = roles.ToArray()
            });
        }



        // Delete a user
        [HttpDelete("{id}")]
        //[Authorize(Roles = UserRoleNames.Admin)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        // Update user roles
        [HttpPut("{id}/roles")]
        //[Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<UserDto>> UpdateUserRoles(int id, [FromBody] string[] newRoles)
        {
            // Validate that all roles exist
            if (newRoles == null || newRoles.Length == 0 || !newRoles.All(x => roles.Any(y => x == y.Name)))
            {
                return BadRequest("One or more roles do not exist");
            }

            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            // Get current roles
            var currentRoles = await userManager.GetRolesAsync(user);

            // Remove all current roles
            var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                return BadRequest(removeResult.Errors);
            }

            // Add new roles
            var addResult = await userManager.AddToRolesAsync(user, newRoles);
            if (!addResult.Succeeded)
            {
                return BadRequest(addResult.Errors);
            }

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = newRoles
            };
        }
    }
}