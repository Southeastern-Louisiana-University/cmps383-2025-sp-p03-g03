using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

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
        where TEntity : class, IEntity
        where TDto : class
    {
        protected readonly DbContext _context;
        protected readonly DbSet<TEntity> _dbSet;
        protected readonly IMapper _mapper;

        public GenericController(DbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = context.Set<TEntity>(); // Fixed the assignment syntax
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        // GET: api/[controller]
        [HttpGet]
        [Authorize(Roles = "Admin,Users")]
        public virtual async Task<ActionResult<IEnumerable<TDto>>> GetAll()
        {
            var entities = await _dbSet.AsNoTracking().ToListAsync();
            return Ok(_mapper.Map<IEnumerable<TDto>>(entities));
        }

        // GET: api/[controller]/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Users")]
        public virtual async Task<ActionResult<TDto>> GetById(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return NotFound();
            return Ok(_mapper.Map<TDto>(entity));
        }

        // POST: api/[controller]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public virtual async Task<ActionResult<TDto>> Create(TDto dto)
        {
            if (dto == null) return BadRequest("Invalid data.");

            // Map DTO to entity
            var entity = _mapper.Map<TEntity>(dto);

            // Validate required fields
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(entity);
            if (!Validator.TryValidateObject(entity, validationContext, validationResults, true))
            {
                var errors = validationResults
                    .Select(vr => new { Field = vr.MemberNames.FirstOrDefault() ?? "Unknown", Message = vr.ErrorMessage })
                    .ToList();

                return BadRequest(new { Message = "Validation failed", Errors = errors });
            }

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
        [Authorize(Roles = "Admin")]
        public virtual async Task<IActionResult> Update(int id, TDto dto)
        {
            if (dto == null || id <= 0) return BadRequest("Invalid data.");
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return NotFound();

            // Map DTO to entity
            _mapper.Map(dto, entity);

            // Validate required fields
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(entity);
            if (!Validator.TryValidateObject(entity, validationContext, validationResults, true))
            {
                var errors = validationResults
                    .Select(vr => new { Field = vr.MemberNames.FirstOrDefault() ?? "Unknown", Message = vr.ErrorMessage })
                    .ToList();

                return BadRequest(new { Message = "Validation failed", Errors = errors });
            }

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
        [Authorize(Roles = "Admin")]
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

        protected virtual async Task<bool> EntityExists(int id)
        {
            return await _dbSet.AnyAsync(e => e.Id == id);
        }
    }
}