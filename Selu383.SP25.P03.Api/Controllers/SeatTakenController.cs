using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Rooms;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatTakenController : GenericController<SeatTaken, SeatTakenDTO>
    {
        public SeatTakenController(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

        // READ - Get by all IDs
        [HttpGet("GetBySchedule/{theaterId}/{MovieScheduleId}/{RoomId}/{SeatId}")]
        public async Task<ActionResult<IEnumerable<SeatTaken>>> GetRoomByTheaterId(
            int theaterId, int MovieScheduleId, int RoomId, int SeatId)
        {
            var result = await _context.Set<SeatTaken>()
                .Where(i =>
                    i.TheaterId == theaterId &&
                    i.MovieScheduleId == MovieScheduleId &&
                    i.RoomsId == RoomId &&
                    i.SeatTypeId == SeatId)
                .ToListAsync();

            return Ok(result);
        }

        // CREATE
        //[HttpPost("NewSeatTaken")]
        //public async Task<ActionResult<SeatTaken>> CreateNewSeatTaken([FromBody] SeatTaken newSeatTaken)
        //{
        //    _context.Set<SeatTaken>().Add(newSeatTaken);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetRoomByTheaterId), new
        //    {
        //        theaterId = newSeatTaken.TheaterId,
        //        MovieScheduleId = newSeatTaken.MovieScheduleId,
        //        RoomId = newSeatTaken.RoomsId,
        //        SeatId = newSeatTaken.SeatTypeId
        //    }, newSeatTaken);
        //}

        // UPDATE
        [HttpPut("{theaterId}/{MovieScheduleId}/{RoomId}/{SeatId}")]
        public async Task<IActionResult> UpdateSeatTaken(int TheaterId, int MovieScheduleId, int RoomId, int SeatId, [FromBody] SeatTaken updatedSeatTaken)
        {
            var existing = await _context.Set<SeatTaken>().FirstOrDefaultAsync(i =>
                i.TheaterId == TheaterId &&
                i.MovieScheduleId == MovieScheduleId &&
                i.RoomsId == RoomId &&
                i.SeatTypeId == SeatId);

            if (existing == null)
            {
                return NotFound();
            }

            _context.Entry(existing).CurrentValues.SetValues(updatedSeatTaken);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{theaterId}/{MovieScheduleId}/{RoomId}/{SeatId}")]
        public async Task<IActionResult> DeleteSeatTaken(int theaterId, int MovieScheduleId, int RoomId, int SeatId)
        {
            var existing = await _context.Set<SeatTaken>().FirstOrDefaultAsync(i =>
                i.TheaterId == theaterId &&
                i.MovieScheduleId == MovieScheduleId &&
                i.RoomsId == RoomId &&
                i.SeatTypeId == SeatId);

            if (existing == null)
            {
                return NotFound();
            }

            _context.Set<SeatTaken>().Remove(existing);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
