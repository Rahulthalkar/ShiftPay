using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShiftPay.DB.Migrations
{
    /// <inheritdoc />
    public partial class tblresetupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OTP",
                table: "Resets");

            migrationBuilder.RenameColumn(
                name: "Uuid",
                table: "Resets",
                newName: "PasswordChangesUuid");

            migrationBuilder.RenameColumn(
                name: "ResetId",
                table: "Resets",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordChangesUuid",
                table: "Resets",
                newName: "Uuid");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Resets",
                newName: "ResetId");

            migrationBuilder.AddColumn<string>(
                name: "OTP",
                table: "Resets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
