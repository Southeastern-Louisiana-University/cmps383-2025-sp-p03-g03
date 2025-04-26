using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangedProductPriceRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductPrices_Theaters_ProductId",
                table: "ProductPrices");

            migrationBuilder.AddColumn<int>(
                name: "TheaterId",
                table: "ProductPrices",
                type: "int",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductPrices_Theaters_ProductId",
                table: "ProductPrices",
                column: "ProductId",
                principalTable: "Theaters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductPrices_Theaters_ProductId",
                table: "ProductPrices");

            migrationBuilder.DropColumn(
                name: "TheaterId",
                table: "ProductPrices");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductPrices_Theaters_ProductId",
                table: "ProductPrices",
                column: "ProductId",
                principalTable: "Theaters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
