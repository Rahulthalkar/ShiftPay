using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShiftPay.DB.Migrations
{
    /// <inheritdoc />
    public partial class tblupdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordChangesUuid",
                table: "Resets",
                newName: "PasswordChangesGuid");

            migrationBuilder.UpdateData(
                table: "EmailConfigurations",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "UserName" },
                values: new object[] { "mxkk siew pkfs mbkv", "rahulthalkar.akkomplish@gmail.com" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordChangesGuid",
                table: "Resets",
                newName: "PasswordChangesUuid");

            migrationBuilder.UpdateData(
                table: "EmailConfigurations",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "UserName" },
                values: new object[] { "mxkksiewpkfsmbkv", "" });
        }
    }
}
