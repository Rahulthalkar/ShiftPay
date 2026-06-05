using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Linq;

namespace ShiftPay.DAL
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly string connectionString;

        public DashboardRepository(IConfiguration configuration)
        {
            connectionString = Convert.ToString(configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
        }

        public APIResult<AdminDashboardStatsModel> GetAdminDashboardStats()
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                var result = new APIResult<AdminDashboardStatsModel>();
                try
                {
                    // 1. Total Workers all user
                    var totalWorkers = dbContext.Users.Count();

                    // 1b. Worker Growth vs Last Week
                    var lastWeekDate = DateTime.UtcNow.AddDays(-7);
                    var workersCreatedBeforeLastWeek = dbContext.Users.Count(u => u.RoleId == 3 && u.CreatedAt <= lastWeekDate);
                    double totalWorkersChangePercent = 0;
                    if (workersCreatedBeforeLastWeek > 0)
                    {
                        totalWorkersChangePercent = Math.Round(((double)(totalWorkers - workersCreatedBeforeLastWeek) / workersCreatedBeforeLastWeek) * 100, 2);
                    }
                    else if (totalWorkers > 0)
                    {
                        totalWorkersChangePercent = 100;
                    }

                    // 2. Monthly Payroll (Current calendar month)
                    var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                    var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
                    var monthlyPayroll = dbContext.Attendances
                        .Where(a => a.Date >= firstDayOfMonth && a.Date <= lastDayOfMonth)
                        .Sum(a => (decimal?)a.Salary) ?? 0;

                    // 2b. Monthly Payroll Growth vs Last Month
                    var firstDayOfLastMonth = firstDayOfMonth.AddMonths(-1);
                    var lastDayOfLastMonth = firstDayOfMonth.AddDays(-1);
                    var lastMonthPayroll = dbContext.Attendances
                        .Where(a => a.Date >= firstDayOfLastMonth && a.Date <= lastDayOfLastMonth)
                        .Sum(a => (decimal?)a.Salary) ?? 0;
                    double monthlyPayrollChangePercent = 0;
                    if (lastMonthPayroll > 0)
                    {
                        monthlyPayrollChangePercent = Math.Round((double)((monthlyPayroll - lastMonthPayroll) / lastMonthPayroll) * 100, 2);
                    }
                    else if (monthlyPayroll > 0)
                    {
                        monthlyPayrollChangePercent = 100;
                    }

                    // 3. Active Users (IsActive == true)
                    var activeUsers = dbContext.Users.Count(u => u.IsActive);

                    // 4. Pending Approvals Count (Status == false)
                    var pendingApprovalsCount = dbContext.Attendances.Count(a => !a.Status);

                    // 5. Approved Attendances Count (Status == true)
                    var approvedAttendancesCount = dbContext.Attendances.Count(a => a.Status);

                    // 6. Total Advance Count & Amount
                    var totalAdvanceCount = dbContext.AdvancePayments.Count();
                    var totalAdvanceAmount = dbContext.AdvancePayments.Sum(a => (decimal?)a.Amount) ?? 0;

                    // 7. Total Approvals Count (Overall Approved Attendances Count)
                    var totalApprovalsCount = approvedAttendancesCount;

                    var stats = new AdminDashboardStatsModel
                    {
                        TotalWorkers = totalWorkers,
                        TotalWorkersChangePercent = totalWorkersChangePercent,
                        MonthlyPayroll = monthlyPayroll,
                        MonthlyPayrollChangePercent = monthlyPayrollChangePercent,
                        ActiveUsers = activeUsers,
                        PendingApprovalsCount = pendingApprovalsCount,
                        ApprovedAttendancesCount = approvedAttendancesCount,
                        TotalAdvanceCount = totalAdvanceCount,
                        TotalAdvanceAmount = totalAdvanceAmount,
                        TotalApprovalsCount = totalApprovalsCount
                    };

                    result.Value = stats;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                }
                catch (Exception ex)
                {
                    result.Value = null;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorRetrievingDashboardStats";
                    result.ExceptionInfo = ex.ToString();
                }

                return result;
            }
        }
    }
}
