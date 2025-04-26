using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Selu383.SP25.P03.Api.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class SeatController : GenericController<Seat, SeatDto>
    {
        public SeatController(DataContext context, IMapper mapper) : base(context, mapper)
        {
        }

        // GET: api/Seat/GetByRoomId/5
        [AllowAnonymous]
        [HttpGet("GetByRoomId/{roomId}")]
        public async Task<ActionResult<IEnumerable<Seat>>> GetByRoomId(int roomId)
        {
            var seats = await _context.Set<Seat>()
                .Where(i => i.RoomsId == roomId)
                .ToListAsync();

            return seats;
        }

        // POST: api/Seat/batch
        [HttpPost("batch")]
        public async Task<ActionResult<IEnumerable<SeatDto>>> CreateBatch([FromBody] List<SeatDto> dtos)
        {
            if (dtos == null || !dtos.Any())
                return BadRequest("No seats provided");

            var entities = _mapper.Map<List<Seat>>(dtos);

            await _context.AddRangeAsync(entities);
            await _context.SaveChangesAsync();

            var resultDtos = _mapper.Map<List<SeatDto>>(entities);
            return Ok(resultDtos);
        }

        // DELETE: api/Seat/room/5
        [HttpDelete("room/{roomId}")]
        public async Task<IActionResult> DeleteByRoomId(int roomId)
        {
            var seats = await _context.Set<Seat>()
                .Where(s => s.RoomsId == roomId)
                .ToListAsync();

            if (!seats.Any())
                return NotFound();

            _context.RemoveRange(seats);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Seat/generate
        [HttpPost("generate")]
        public async Task<ActionResult<IEnumerable<SeatDto>>> GenerateSeats([FromBody] GenerateSeatsRequest request)
        {
            if (request.Rows <= 0 || request.Columns <= 0)
                return BadRequest("Rows and columns must be greater than zero");

            // Verify that the seat type exists
            var seatType = await _context.Set<SeatType>().FindAsync(request.DefaultSeatTypeId);
            if (seatType == null)
                return BadRequest($"Seat type with ID {request.DefaultSeatTypeId} not found");

            // Delete existing seats for the room if they exist
            var existingSeats = await _context.Set<Seat>()
                .Where(s => s.RoomsId == request.RoomId)
                .ToListAsync();

            if (existingSeats.Any())
            {
                _context.RemoveRange(existingSeats);
                await _context.SaveChangesAsync();
            }

            // Generate new seats
            var seats = new List<Seat>();
            int yPosition = 1;

            for (int rowIndex = 0; rowIndex < request.Rows; rowIndex++)
            {
                string rowLabel = GetRowLabel(rowIndex);

                for (int colIndex = 0; colIndex < request.Columns; colIndex++)
                {
                    int seatNumber = colIndex + 1;
                    int xPosition = colIndex + 1;

                    seats.Add(new Seat
                    {
                        RoomsId = request.RoomId,
                        SeatTypeId = request.DefaultSeatTypeId,
                        isAvailable = true,
                        Row = rowLabel,
                        SeatNumber = seatNumber,
                        xPosition = xPosition,
                        yPosition = yPosition
                    });
                }

                yPosition++;
            }

            await _context.AddRangeAsync(seats);
            await _context.SaveChangesAsync();

            var resultDtos = _mapper.Map<List<SeatDto>>(seats);
            return Ok(resultDtos);
        }

        private string GetRowLabel(int rowIndex)
        {
            if (rowIndex < 26)
            {
                return ((char)(65 + rowIndex)).ToString(); // A-Z
            }

            // For rows beyond Z (26+)
            char firstChar = (char)(65 + (rowIndex / 26) - 1);
            char secondChar = (char)(65 + (rowIndex % 26));

            return $"{firstChar}{secondChar}";
        }
    }

    public class GenerateSeatsRequest
    {
        public int RoomId { get; set; }
        public int Rows { get; set; }
        public int Columns { get; set; }
        public int DefaultSeatTypeId { get; set; } = 1;
    }
}