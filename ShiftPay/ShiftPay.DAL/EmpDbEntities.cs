using Microsoft.EntityFrameworkCore;
using ShiftPay.Domain.Tables;
namespace ShiftPay.DAL
{
    public class EmpDbEntities: DbContext
    {
        public string ConnectionString { get; }    
        public EmpDbEntities(string connectionString)
        {
            ConnectionString= connectionString;
        }
        public DbSet<tblAttendance> Attendances { get; set; }
        public DbSet<tblUser> Users { get; set; }
        public DbSet<tblAuditLog> AuditLogs { get; set; }
        public DbSet<tblAdvancePayment> AdvancePayments { get; set; }
        public DbSet<tblUserRole> Roles { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)   
        {
            optionsBuilder.UseSqlServer(ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }
        }
    }
}
