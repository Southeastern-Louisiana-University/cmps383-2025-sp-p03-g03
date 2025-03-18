using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class MoreEntityConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovieRoomScheduleLinks_Room_RoomId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_Room_Theaters_TheaterId",
                table: "Room");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Room",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "SeatCount",
                table: "Theaters");

            migrationBuilder.RenameTable(
                name: "Room",
                newName: "Rooms");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Products",
                newName: "TheaterId");

            migrationBuilder.RenameIndex(
                name: "IX_Room_TheaterId",
                table: "Rooms",
                newName: "IX_Rooms_TheaterId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(120)",
                oldMaxLength: 120);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Theaters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Address1",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address2",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone1",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone2",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Zip",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "EndDate",
                table: "ProductPrices",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "ProductPrices",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateOnly>(
                name: "StartDate",
                table: "ProductPrices",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Movies",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Rooms",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<bool>(
                name: "IsPremium",
                table: "Rooms",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Products_TheaterId",
                table: "Products",
                column: "TheaterId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPrices_ProductId",
                table: "ProductPrices",
                column: "ProductId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Theaters_TheaterId",
                table: "Products",
                column: "TheaterId",
                principalTable: "Theaters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Theaters_TheaterId",
                table: "Rooms",
                column: "TheaterId",
                principalTable: "Theaters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovieRoomScheduleLinks_Rooms_RoomId",
                table: "MovieRoomScheduleLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductPrices_Products_ProductId",
                table: "ProductPrices");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Theaters_TheaterId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Theaters_TheaterId",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Products_TheaterId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_ProductPrices_ProductId",
                table: "ProductPrices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "Address1",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "Address2",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "Phone1",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "Phone2",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "ProductPrices");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "ProductPrices");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "ProductPrices");

            migrationBuilder.DropColumn(
                name: "IsPremium",
                table: "Rooms");

            migrationBuilder.RenameTable(
                name: "Rooms",
                newName: "Room");

            migrationBuilder.RenameColumn(
                name: "TheaterId",
                table: "Products",
                newName: "Price");

            migrationBuilder.RenameIndex(
                name: "IX_Rooms_TheaterId",
                table: "Room",
                newName: "IX_Room_TheaterId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Theaters",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SeatCount",
                table: "Theaters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Movies",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Room",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Room",
                table: "Room",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieRoomScheduleLinks_Room_RoomId",
                table: "MovieRoomScheduleLinks",
                column: "RoomId",
                principalTable: "Room",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Theaters_TheaterId",
                table: "Room",
                column: "TheaterId",
                principalTable: "Theaters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
