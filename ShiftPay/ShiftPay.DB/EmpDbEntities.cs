using Microsoft.EntityFrameworkCore;
using ShiftPay.Domain.Tables;
using System.Net.Sockets;

namespace ShiftPay
{
    public class EmpDbEntities:DbContext
    {
        private readonly IConfiguration _configuration;
        public EmpDbEntities(DbContextOptions options,IConfiguration configuration):base(options)
        {
            _configuration = configuration;
        }
        public DbSet<tblAttendance> Attendances { get; set; }
        public DbSet<tblUser> Users { get; set; }
        public DbSet<tblAuditLog> AuditLogs { get; set; }
        public DbSet<tblAdvancePayment> AdvancePayments { get; set; }       
        public DbSet<tblUserRole> Roles { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }
            base.OnModelCreating(modelBuilder);
            var counter = 1;
            modelBuilder.Entity<tblUserRole>().HasData(
             new tblUserRole { Id = counter++, Role = "Admin", },
             new tblUserRole { Id = counter++, Role = "Manager", },
             new tblUserRole { Id = counter++, Role = "Worker", }  
             );
             counter = 1;
            modelBuilder.Entity<tblUser>().HasData(
      new tblUser
      {
          Id = 1,
          Name = "Admin",
          PhoneNumber = "",
          Username = "Admin",
          PasswordHash = "$2a$11$WvEHgVrROnCezjp/2ie5JeERwQq/xVDd/pmN.2U9E5RCqDF58yRWy",
          RoleId = 1,
          ProfileImageUrl = "",
          CreatedAt = new DateTime(2026, 1, 1), // ✅ FIXED
          CreatedBy = 0,
          DailyRate = 1200,
          ManagerId = 0,
          IsActive = true
      }
  );


        }
       
    }
} 
