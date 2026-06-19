using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShiftPay.DB.Migrations
{
    /// <inheritdoc />
    public partial class tblemailconfigurations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    From = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Host = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Port = table.Column<int>(type: "int", nullable: false),
                    UseSSL = table.Column<bool>(type: "bit", nullable: false),
                    UseStartTls = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailConfigurations", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "EmailConfigurations",
                columns: new[] { "Id", "DisplayName", "From", "Host", "Password", "Port", "UseSSL", "UseStartTls", "UserName" },
                values: new object[] { 1, "ShiftType", "rahulthalkar.akkomplish@gmail.com", "smtp.gmail.com", "mxkksiewpkfsmbkv", 587, true, false, "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailConfigurations");
        }
    }
}
