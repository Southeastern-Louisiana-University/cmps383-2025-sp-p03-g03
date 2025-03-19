using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixEntityIssues2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovieRoomScheduleLinks_MovieSchedules_MovieScheduleId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieRoomScheduleLinks_Movies_MovieId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieRoomScheduleLinks_Rooms_RoomId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductPrices_Products_ProductId",
                table: "ProductPrices");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRoomScheduleLinks_MovieSchedules_MovieScheduleId",
                table: "MovieRoomScheduleLinks",
                column: "MovieScheduleId",
                principalTable: "MovieSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRoomScheduleLinks_Movies_MovieId",
                table: "MovieRoomScheduleLinks",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRoomScheduleLinks_Rooms_RoomId",
                table: "MovieRoomScheduleLinks",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductPrices_Products_ProductId",
                table: "ProductPrices",
                column: "ProductId",
                principalTable: "Products",
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
                name: "FK_MovieRoomScheduleLinks_Rooms_RoomId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductPrices_Products_ProductId",
                table: "ProductPrices");

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
                name: "FK_MovieRoomScheduleLinks_Rooms_RoomId",
                table: "MovieRoomScheduleLinks",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductPrices_Products_ProductId",
                table: "ProductPrices",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");
        }
    }
}
