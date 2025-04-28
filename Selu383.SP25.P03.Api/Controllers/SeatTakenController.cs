using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Controllers;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Rooms;
using Selu383.SP25.P03.Api.Features.Seats;

[Route("api/[controller]")]
[ApiController]
[AllowAnonymous]
public class SeatTakenController : GenericController<SeatTaken, SeatTakenDTO>
{
    
    
    public SeatTakenController(DataContext context, IMapper mapper)
        : base(context, mapper)
    {
    }

    [HttpGet("GetBySchedule/{theaterId}/{movieScheduleId}/{roomId}")]
    public async Task<ActionResult<IEnumerable<SeatTaken>>> GetRoomByTheaterId(
        int theaterId, int movieScheduleId, int roomId)
    {
        var result = await _context.Set<SeatTaken>()
            .Where(i =>
                i.TheaterId == theaterId &&
                i.MovieScheduleId == movieScheduleId &&
                i.RoomsId == roomId) 
                //i.SeatId == seatId)
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost("Create")]
    [AllowAnonymous]
    public async Task<ActionResult<SeatTaken>> CreateSeatTaken([FromBody] SeatTaken newSeatTaken)
    {
        _context.Set<SeatTaken>().Add(newSeatTaken);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoomByTheaterId), new
        {
            theaterId = newSeatTaken.TheaterId,
            movieScheduleId = newSeatTaken.MovieScheduleId,
            roomId = newSeatTaken.RoomsId,
            seatId = newSeatTaken.SeatId
        }, newSeatTaken);
    }

    [HttpPut("Update/{theaterId}/{movieScheduleId}/{roomId}/{seatId}")]
    public async Task<IActionResult> UpdateSeatTaken(
        int theaterId, int movieScheduleId, int roomId, int seatId,
        [FromBody] SeatTaken updatedSeatTaken)
    {
        var existing = await _context.Set<SeatTaken>()
            .FirstOrDefaultAsync(i =>
                i.TheaterId == theaterId &&
                i.MovieScheduleId == movieScheduleId &&
                i.RoomsId == roomId &&
                i.SeatId == seatId);

        if (existing == null)
        {
            return NotFound();
        }

        _context.Entry(existing).CurrentValues.SetValues(updatedSeatTaken);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("Delete/{theaterId}/{movieScheduleId}/{roomId}/{seatId}")]
    public async Task<IActionResult> DeleteSeatTaken(
        int theaterId, int movieScheduleId, int roomId, int seatId)
    {
        var existing = await _context.Set<SeatTaken>()
            .FirstOrDefaultAsync(i =>
                i.TheaterId == theaterId &&
                i.MovieScheduleId == movieScheduleId &&
                i.RoomsId == roomId &&
                i.SeatId == seatId);

        if (existing == null)
        {
            return NotFound();
        }

        _context.Set<SeatTaken>().Remove(existing);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
