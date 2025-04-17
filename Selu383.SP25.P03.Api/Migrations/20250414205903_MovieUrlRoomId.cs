using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class MovieUrlRoomId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "MovieId",
                table: "MovieSchedules",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "MovieSchedules",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreviewURL",
                table: "Movies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MovieSchedules_RoomId",
                table: "MovieSchedules",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieSchedules_Rooms_RoomId",
                table: "MovieSchedules",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovieSchedules_Rooms_RoomId",
                table: "MovieSchedules");

            migrationBuilder.DropIndex(
                name: "IX_MovieSchedules_RoomId",
                table: "MovieSchedules");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "MovieSchedules");

            migrationBuilder.DropColumn(
                name: "PreviewURL",
                table: "Movies");

            migrationBuilder.AlterColumn<int>(
                name: "MovieId",
                table: "MovieSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
