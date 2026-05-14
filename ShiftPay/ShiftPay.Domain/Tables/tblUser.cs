using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace ShiftPay.Domain.Tables
{
    public class tblUser
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public int RoleId { get; set; }
        public tblUserRole Role { get; set; }

        public string Name { get; set; } = string.Empty;
        public decimal DailyRate { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? PhoneNumber { get; set; }

        public bool IsActive { get; set; }
        public int? ManagerId { get; set; }
        public int CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // Navigation Property
        public ICollection<tblAttendance> WorkEntries { get; set; } = new List<tblAttendance>();

    }
}
