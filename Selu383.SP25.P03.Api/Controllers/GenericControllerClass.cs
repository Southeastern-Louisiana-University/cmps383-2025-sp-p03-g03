using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    // Interface for entities with an ID property
    public interface IEntity
    {
        int Id { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class GenericController<TEntity, TDto> : ControllerBase
        where TEntity : class, IEntity, new()
        where TDto : class
    {
        private readonly DbContext _context;
        private readonly DbSet<TEntity> _dbSet;
        private readonly IMapper _mapper;


        public GenericController(DbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<TEntity>();
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        // GET: api/[controller]
        [HttpGet]
        public virtual async Task<ActionResult<IEnumerable<TDto>>> GetAll()
        {
            var entities = await _dbSet.AsNoTracking().ToListAsync();
            return Ok(_mapper.Map<IEnumerable<TDto>>(entities));
        }

        // GET: api/[controller]/5
        [HttpGet("{id}")]
        public virtual async Task<ActionResult<TDto>> GetById(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return NotFound();

            return Ok(_mapper.Map<TDto>(entity));
        }

        // POST: api/[controller]
        [HttpPost]
        public virtual async Task<ActionResult<TDto>> Create(TDto dto)
        {
            if (dto == null) return BadRequest("Invalid data.");

            var entity = _mapper.Map<TEntity>(dto);
            _dbSet.Add(entity);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest($"Database error: {ex.Message}");
            }

            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, _mapper.Map<TDto>(entity));
        }

        // PUT: api/[controller]/5
        [HttpPut("{id}")]
        public virtual async Task<IActionResult> Update(int id, TDto dto)
        {
            if (dto == null || id <= 0) return BadRequest("Invalid data.");

            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return NotFound();

            _mapper.Map(dto, entity);
            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await EntityExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/[controller]/5
        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return NotFound();

            _dbSet.Remove(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest($"Database error: {ex.Message}");
            }

            return NoContent();
        }

        private async Task<bool> EntityExists(int id)
        {
            return await _dbSet.FindAsync(id) != null;
        }
    }
}
