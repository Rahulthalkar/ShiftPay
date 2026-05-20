using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ShiftPay.Domain.Model
{
    public class AttendanceModel
    {
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
        public tblUser? User { get; set; }
    }
    public class AttendanceRequestModel
    {
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public ShiftType ShiftType { get; set; } = ShiftType.Day;
        public decimal? Salary { get; set; }
        public bool? Status { get; set; }
        public int? ApporveById { get; set; }
        // Attendance tracking
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTime? ClockInTime { get; set; }
        public DateTime? ClockOutTime { get; set; }

    }


    public class WorkerDashboardResponse
    {
        public int WorkerId { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int TotalShifts { get; set; }

        public double TotalDays { get; set; }

        public decimal TotalSalary { get; set; }

        public decimal TotalAdvance { get; set; }

        public decimal Balance { get; set; }

        public ShiftCountResponse ShiftCounts { get; set; } = new();

        public List<MonthlyTotalDaysResponse> MonthlyTotalDays { get; set; } = new();

        public List<WorkEntryResponse> WorkEntries { get; set; } = new();

        public List<AdvancePaymentResponse> AdvancePayments { get; set; } = new();
    }
    public class ShiftCountResponse
    {
        public int Day { get; set; }

        public int FullNight { get; set; }

        public int FirstHalfDay { get; set; }

        public int SecondHalfDay { get; set; }

        public int HalfDay { get; set; }

        public int HalfNight { get; set; }

        public int DoubleNight { get; set; }
    }
    public class MonthlyTotalDaysResponse
    {
        public string Month { get; set; } = string.Empty;

        public double TotalDays { get; set; }
    }
    public class WorkEntryResponse
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public ShiftType ShiftType { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public decimal Salary { get; set; }
    }
    public class AdvancePaymentResponse
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public decimal Amount { get; set; }

        public string? Remarks { get; set; }
    }
    public class SupervisorWorkerModel
    {
        public int ManagerId { get; set; }
        public int AttendanceId { get; set; }
        public string? Name { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }
        public ShiftType ShiftType { get; set; }
        public string Status { get; set; }

    }
    public class ApprovalBatchModel
    {
        public List<int> AttendanceIds { get; set; } = new List<int>();
        public int ManagerId { get; set; }
    }
}
