using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShiftPay.DB.Migrations
{
    /// <inheritdoc />
    public partial class emtchanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "EmailConfigurations",
                keyColumn: "Id",
                keyValue: 1,
                column: "DisplayName",
                value: "ShiftPay");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "EmailConfigurations",
                keyColumn: "Id",
                keyValue: 1,
                column: "DisplayName",
                value: "ShiftType");
        }
    }
}
