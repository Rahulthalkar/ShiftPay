using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.Domain.Model
{
    public class AdminDashboardStatsModel
    {
        public int TotalWorkers { get; set; }
        public double TotalWorkersChangePercent { get; set; }
        public decimal MonthlyPayroll { get; set; }
        public double MonthlyPayrollChangePercent { get; set; }
        public int ActiveUsers { get; set; }
        public int PendingApprovalsCount { get; set; }
        public int ApprovedAttendancesCount { get; set; }
        public int TotalAdvanceCount { get; set; }
        public decimal TotalAdvanceAmount { get; set; }
        public int TotalApprovalsCount { get; set; }
    }
}
