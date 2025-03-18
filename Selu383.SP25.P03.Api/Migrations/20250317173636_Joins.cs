using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class Joins : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TheaterId",
                table: "Room",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MovieId",
                table: "MovieSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Room_TheaterId",
                table: "Room",
                column: "TheaterId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieSchedules_MovieId",
                table: "MovieSchedules",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieRoomScheduleLinks_MovieId",
                table: "MovieRoomScheduleLinks",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieRoomScheduleLinks_MovieScheduleId",
                table: "MovieRoomScheduleLinks",
                column: "MovieScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieRoomScheduleLinks_RoomId",
                table: "MovieRoomScheduleLinks",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRoomScheduleLinks_MovieSchedules_MovieScheduleId",
                table: "MovieRoomScheduleLinks",
                column: "MovieScheduleId",
                principalTable: "MovieSchedules",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRoomScheduleLinks_Movies_MovieId",
                table: "MovieRoomScheduleLinks",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRoomScheduleLinks_Room_RoomId",
                table: "MovieRoomScheduleLinks",
                column: "RoomId",
                principalTable: "Room",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieSchedules_Movies_MovieId",
                table: "MovieSchedules",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Theaters_TheaterId",
                table: "Room",
                column: "TheaterId",
                principalTable: "Theaters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovieRoomScheduleLinks_MovieSchedules_MovieScheduleId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieRoomScheduleLinks_Movies_MovieId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieRoomScheduleLinks_Room_RoomId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieSchedules_Movies_MovieId",
                table: "MovieSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Room_Theaters_TheaterId",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Room_TheaterId",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_MovieSchedules_MovieId",
                table: "MovieSchedules");

            migrationBuilder.DropIndex(
                name: "IX_MovieRoomScheduleLinks_MovieId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropIndex(
                name: "IX_MovieRoomScheduleLinks_MovieScheduleId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropIndex(
                name: "IX_MovieRoomScheduleLinks_RoomId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropColumn(
                name: "TheaterId",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "MovieId",
                table: "MovieSchedules");
        }
    }
}
