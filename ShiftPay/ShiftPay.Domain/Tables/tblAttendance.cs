using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace ShiftPay.Domain.Tables
{
    public class tblAttendance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttendanceId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public ShiftType ShiftType { get; set; } = ShiftType.Day;
        public decimal Salary { get; set; }
        public bool Status { get; set; }
        public int ApporveById { get; set; }
        // Attendance tracking
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTime? ClockInTime { get; set; }
        public DateTime? ClockOutTime { get; set; }

        // Navigation Property
        [JsonIgnore]
        public tblUser? Worker { get; set; }
    }
}
