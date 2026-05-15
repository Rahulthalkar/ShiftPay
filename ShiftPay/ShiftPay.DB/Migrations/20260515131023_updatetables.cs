using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShiftPay.DB.Migrations
{
    /// <inheritdoc />
    public partial class updatetables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Users_WorkerId",
                table: "Attendances");

            migrationBuilder.RenameColumn(
                name: "WorkerId",
                table: "Attendances",
                newName: "UsersId");

            migrationBuilder.RenameIndex(
                name: "IX_Attendances_WorkerId",
                table: "Attendances",
                newName: "IX_Attendances_UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Users_UsersId",
                table: "Attendances",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Users_UsersId",
                table: "Attendances");

            migrationBuilder.RenameColumn(
                name: "UsersId",
                table: "Attendances",
                newName: "WorkerId");

            migrationBuilder.RenameIndex(
                name: "IX_Attendances_UsersId",
                table: "Attendances",
                newName: "IX_Attendances_WorkerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Users_WorkerId",
                table: "Attendances",
                column: "WorkerId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
