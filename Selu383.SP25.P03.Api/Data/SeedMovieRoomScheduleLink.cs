//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Logging;
//using Selu383.SP25.P03.Api.Features.Movies;

//namespace Selu383.SP25.P03.Api.Data
//{
//    public class SeedMovieRoomScheduleLinks
//    {
//        public static async Task InitializeAsync(IServiceProvider serviceProvider)
//        {
//            using (var dataContext = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
//            {
//                // Get necessary data
//                var theaters = await dataContext.Theaters.ToListAsync();
//                var rooms = await dataContext.Rooms.ToListAsync();
//                var movies = await dataContext.Movies.ToListAsync();
//                var schedules = await dataContext.MovieSchedules.ToListAsync();

//                // Seed Movie-Room-Schedule Links
//                if (!dataContext.MovieRoomScheduleLinks.Any() && theaters.Any() && rooms.Any() && movies.Any() && schedules.Any())
//                {
//                    var nolaTheater = theaters.FirstOrDefault(t => t.Name == "Lion's Den Cinemas: New Orleans");
//                    var nyTheater = theaters.FirstOrDefault(t => t.Name == "Lion's Den Cinemas: New York");

//                    if (nolaTheater == null || nyTheater == null)
//                    {
//                        var logger = serviceProvider.GetRequiredService<ILogger<SeedMovieRoomScheduleLinks>>();
//                        logger.LogWarning("Cannot seed MovieRoomScheduleLinks - required theaters not found");
//                        return;
//                    }

//                    // Find rooms by theater and name
//                    var room1 = rooms.FirstOrDefault(r => r.TheaterId == nolaTheater.Id && r.Name == "Room 1");
//                    var room2 = rooms.FirstOrDefault(r => r.TheaterId == nolaTheater.Id && r.Name == "Room 2");
//                    var room3 = rooms.FirstOrDefault(r => r.TheaterId == nolaTheater.Id && r.Name == "Room 3");
//                    var room4 = rooms.FirstOrDefault(r => r.TheaterId == nolaTheater.Id && r.Name == "Room 4");

//                    var auditoriumA = rooms.FirstOrDefault(r => r.TheaterId == nyTheater.Id && r.Name == "Auditorium A");
//                    var auditoriumB = rooms.FirstOrDefault(r => r.TheaterId == nyTheater.Id && r.Name == "Auditorium B");
//                    var auditoriumC = rooms.FirstOrDefault(r => r.TheaterId == nyTheater.Id && r.Name == "Auditorium C");
//                    var auditoriumD = rooms.FirstOrDefault(r => r.TheaterId == nyTheater.Id && r.Name == "Auditorium D");

//                    if (room1 == null || room2 == null || room3 == null || room4 == null ||
//                        auditoriumA == null || auditoriumB == null || auditoriumC == null || auditoriumD == null)
//                    {
//                        var logger = serviceProvider.GetRequiredService<ILogger<SeedMovieRoomScheduleLinks>>();
//                        logger.LogWarning("Cannot seed MovieRoomScheduleLinks - required rooms not found");
//                        return;
//                    }

//                    // Match movie schedules by their respective movie IDs
//                    var duneSchedule = schedules.FirstOrDefault(s => s.MovieId == 1);
//                    var godzillaSchedule = schedules.FirstOrDefault(s => s.MovieId == 2);
//                    var apesSchedule = schedules.FirstOrDefault(s => s.MovieId == 3);
//                    var ghostbustersSchedule = schedules.FirstOrDefault(s => s.MovieId == 4);
//                    var fallGuySchedule = schedules.FirstOrDefault(s => s.MovieId == 5);
//                    var quietPlaceSchedule = schedules.FirstOrDefault(s => s.MovieId == 6);
//                    var insideOutSchedule = schedules.FirstOrDefault(s => s.MovieId == 7);
//                    var furiosaSchedule = schedules.FirstOrDefault(s => s.MovieId == 8);
//                    var deadpoolSchedule = schedules.FirstOrDefault(s => s.MovieId == 9);
//                    var badBoysSchedule = schedules.FirstOrDefault(s => s.MovieId == 10);
//                    var garfieldSchedule = schedules.FirstOrDefault(s => s.MovieId == 11);
//                    var oppenheimerSchedule = schedules.FirstOrDefault(s => s.MovieId == 12);

//                    if (duneSchedule == null || godzillaSchedule == null || apesSchedule == null ||
//                        ghostbustersSchedule == null || fallGuySchedule == null || quietPlaceSchedule == null ||
//                        insideOutSchedule == null || furiosaSchedule == null || deadpoolSchedule == null ||
//                        badBoysSchedule == null || garfieldSchedule == null || oppenheimerSchedule == null)
//                    {
//                        var logger = serviceProvider.GetRequiredService<ILogger<SeedMovieRoomScheduleLinks>>();
//                        logger.LogWarning("Cannot seed MovieRoomScheduleLinks - required schedules not found");
//                        return;
//                    }

//                    await dataContext.MovieRoomScheduleLinks.AddRangeAsync(new List<MovieRoomScheduleLink>
//                    {
//                        // Theater 1 (NOLA) Schedules
                        
//                        // IMAX Room (Room 1) - Blockbusters
//                        new ()
//                        {
//                            TheaterId = nolaTheater.Id,
//                            RoomId = room1.Id,
//                            MovieId = duneSchedule.MovieId,
//                            MovieScheduleId = duneSchedule.Id
//                        },
//                        new ()
//                        {
//                            TheaterId = nolaTheater.Id,
//                            RoomId = room1.Id,
//                            MovieId = apesSchedule.MovieId,
//                            MovieScheduleId = apesSchedule.Id
//                        },
                        
//                        // Standard Rooms
//                        new ()
//                        {
//                            TheaterId = nolaTheater.Id,
//                            RoomId = room2.Id,
//                            MovieId = godzillaSchedule.MovieId,
//                            MovieScheduleId = godzillaSchedule.Id
//                        },
//                        new ()
//                        {
//                            TheaterId = nolaTheater.Id,
//                            RoomId = room3.Id,
//                            MovieId = ghostbustersSchedule.MovieId,
//                            MovieScheduleId = ghostbustersSchedule.Id
//                        },
//                        new ()
//                        {
//                            TheaterId = nolaTheater.Id,
//                            RoomId = room4.Id,
//                            MovieId = garfieldSchedule.MovieId,
//                            MovieScheduleId = garfieldSchedule.Id
//                        },
                        
//                        // Theater 2 (NY) Schedules
                        
//                        // IMAX Room (Auditorium A)
//                        new ()
//                        {
//                            TheaterId = nyTheater.Id,
//                            RoomId = auditoriumA.Id,
//                            MovieId = 3, // Kingdom of the Planet of the Apes
//                            MovieScheduleId = apesSchedule.Id
//                        },
                        
//                        // Premium Large Format (Auditorium B)
//                        new ()
//                        {
//                            TheaterId = nyTheater.Id,
//                            RoomId = auditoriumB.Id,
//                            MovieId = 1, // Dune: Part Two
//                            MovieScheduleId = duneSchedule.Id
//                        },
                        
//                        // Standard Rooms
//                        new ()
//                        {
//                            TheaterId = nyTheater.Id,
//                            RoomId = auditoriumC.Id,
//                            MovieId = fallGuySchedule.MovieId,
//                            MovieScheduleId = fallGuySchedule.Id
//                        },
//                        new ()
//                        {
//                            TheaterId = nyTheater.Id,
//                            RoomId = auditoriumD.Id,
//                            MovieId = badBoysSchedule.MovieId,
//                            MovieScheduleId = badBoysSchedule.Id
//                        },
                        
//                        // Coming Soon / Special Screenings
//                        new ()
//                        {
//                            TheaterId = nolaTheater.Id,
//                            RoomId = room1.Id,
//                            MovieId = quietPlaceSchedule.MovieId,
//                            MovieScheduleId = quietPlaceSchedule.Id
//                        },
//                        new ()
//                        {
//                            TheaterId = nyTheater.Id,
//                            RoomId = auditoriumA.Id,
//                            MovieId = furiosaSchedule.MovieId,
//                            MovieScheduleId = furiosaSchedule.Id
//                        },
//                        new ()
//                        {
//                            TheaterId = nyTheater.Id,
//                            RoomId = auditoriumB.Id,
//                            MovieId = deadpoolSchedule.MovieId,
//                            MovieScheduleId = deadpoolSchedule.Id
//                        },
//                        new ()
//                        {
//                            TheaterId = nyTheater.Id,
//                            RoomId = auditoriumC.Id,
//                            MovieId = insideOutSchedule.MovieId,
//                            MovieScheduleId = insideOutSchedule.Id
//                        },
//                        new ()
//                        {
//                            TheaterId = nolaTheater.Id,
//                            RoomId = room2.Id,
//                            MovieId = oppenheimerSchedule.MovieId,
//                            MovieScheduleId = oppenheimerSchedule.Id
//                        }
//                    });

//                    await dataContext.SaveChangesAsync();
//                }
//            }
//        }
//    }
//}