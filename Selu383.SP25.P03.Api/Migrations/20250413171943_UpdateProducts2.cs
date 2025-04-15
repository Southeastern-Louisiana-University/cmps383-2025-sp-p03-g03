using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProducts2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductTypeId1",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductTypeId1",
                table: "Products",
                column: "ProductTypeId1",
                unique: true,
                filter: "[ProductTypeId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductTypes_ProductTypeId1",
                table: "Products",
                column: "ProductTypeId1",
                principalTable: "ProductTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductTypes_ProductTypeId1",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ProductTypeId1",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductTypeId1",
                table: "Products");
        }
    }
}
