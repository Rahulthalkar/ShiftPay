using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly string connectionString;

        public AttendanceRepository(IConfiguration configuration)
        {
            connectionString=Convert.ToString(configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
        }

        // GetAllAttendances already implemented later in file; this method was removed to avoid duplication.

        public APIResult<List<AttendanceModel>> GetAttendancesByMonth(int year, int month)
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                var result = new APIResult<List<AttendanceModel>>();
                try
                {
                    var attendances = dbContext.Attendances
                        .Where(a => a.Date.Year == year && a.Date.Month == month)
                        .Select(a => new AttendanceModel
                        {
                            AttendanceId = a.AttendanceId,
                            UserId = a.UserId,
                            Date = a.Date,
                            StartTime = a.StartTime,
                            EndTime = a.EndTime,
                            ShiftType = (ShiftType)a.ShiftType,
                            Salary = a.Salary,
                            Status = a.Status,
                            ApporveById = a.ApporveById,
                            Latitude = a.Latitude,
                            Longitude = a.Longitude,
                            ClockInTime = a.ClockInTime,
                            ClockOutTime = a.ClockOutTime
                        }).ToList();

                    result.IsSuccess = true;
                    result.Value = attendances;
                    result.ExceptionInfo = "Attendances retrieved successfully.";
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ErrorMessageKey = "ErrorRetrievingAttendances";
                    result.ExceptionInfo = ex.Message;
                }
                return result;
            }
        }

        public APIResult<List<SupervisorWorkerModel>> GetAllWorkerBySupervisorId(int supervisorId)
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<SupervisorWorkerModel>> result = new APIResult<List<SupervisorWorkerModel>>();
                try
                {
                    var workers = (from usr in dbContext.Users
                                   join atte in dbContext.Attendances on usr.Id equals atte.UserId
                                   where usr.ManagerId == supervisorId                                  
                                   select new SupervisorWorkerModel
                                   {
                                       ManagerId = usr.ManagerId.Value,
                                       AttendanceId = atte.AttendanceId,
                                       Name = usr.Name,
                                       Date = atte.Date,
                                       StartTime = atte.StartTime,
                                       EndTime = atte.EndTime,
                                       ShiftType = (ShiftType)atte.ShiftType,
                                       Status = atte.Status ? "APPROVED" : "PENDING"
                                   }).ToList();
                    result.IsSuccess = true;
                    result.Value = workers;
                    result.ExceptionInfo = "Workers retrieved successfully.";
                    return result;
                }
                catch (Exception ex)
                {
                    // Log the exception (not implemented here)
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ErrorMessageKey = "ErrorRetrievingWorkers";
                    result.ExceptionInfo = ex.Message;
                    return result;
                }
            }
        }

        public APIResult<List<AttendanceModel>> GetAttendancesByUserIdAsync(int userId)
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<AttendanceModel>> result = new APIResult<List<AttendanceModel>>();
                try
                {
                    var attendances = dbContext.Attendances
                        .Where(a => a.UserId == userId)
                        .Select(a => new AttendanceModel
                        {
                            AttendanceId = a.AttendanceId,
                            UserId = a.UserId,
                            Date = a.Date,
                            StartTime = a.StartTime,
                            EndTime = a.EndTime,
                            ShiftType =(ShiftType)a.ShiftType,
                            Salary = a.Salary,
                            Status = a.Status,
                            ApporveById = a.ApporveById,
                            Latitude = a.Latitude,
                            Longitude = a.Longitude,
                            ClockInTime = a.ClockInTime,
                            ClockOutTime = a.ClockOutTime
                        }).ToList();
                    result.IsSuccess = true;
                    result.Value = attendances;
                    result.ExceptionInfo = "Attendances retrieved successfully.";
                    return result;
                }
                catch (Exception ex)
                {
                    // Log the exception (not implemented here)
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ErrorMessageKey = "ErrorRetrievingAttendances";
                    result.ExceptionInfo = ex.Message;
                    return result;
                }
            }
        }

        public APIResult<WorkerDashboardResponse> GetDashboardByWorkerFilter(
         int workerId,
         DateTime? startDate,
         DateTime? endDate)
        {
            APIResult<WorkerDashboardResponse> result =
                new APIResult<WorkerDashboardResponse>();

            try
            {
                using (var dbContext = new EmpDbEntities(connectionString))
                {
                    //  Default Current Month
                    var today = DateTime.Today;

                    startDate ??= new DateTime(today.Year, today.Month, 1);

                    endDate ??= startDate.Value.AddMonths(1).AddDays(-1);

                    //  Advance Payments
                    var advances = (from a in dbContext.AdvancePayments
                                    where a.UserId == workerId
                                    && a.Date >= startDate
                                    && a.Date <= endDate
                                    orderby a.Date descending
                                    select a).ToList();

                    //  Attendance / Work Entries
                    var workEntries = (from w in dbContext.Attendances
                                       where w.UserId == workerId
                                       && w.Date >= startDate
                                       && w.Date <= endDate
                                       orderby w.Date descending
                                       select w).ToList();

                    //  Summary
                    int totalShifts = workEntries.Count;

                    decimal totalSalary = workEntries.Sum(w => w.Salary);

                    decimal totalAdvance = advances.Sum(a => a.Amount);

                    //  Shift Counts
                    int dayCount = workEntries.Count(x => x.ShiftType == ShiftType.Day);

                    int fullNightCount = workEntries.Count(x => x.ShiftType == ShiftType.FullNight);

                    int firstHalfDayCount = workEntries.Count(x => x.ShiftType == ShiftType.FirstHalfDay);

                    int secondHalfDayCount = workEntries.Count(x => x.ShiftType == ShiftType.SecondHalfDay);

                    //int halfDayCount = workEntries.Count(x => x.ShiftType == ShiftType.HalfDay);

                    int halfNightCount = workEntries.Count(x => x.ShiftType == ShiftType.HalfNight);

                    int doubleNightCount = workEntries.Count(x => x.ShiftType == ShiftType.DoubleNight);

                    //  Total Days
                    double totalDays =
                        dayCount +
                        fullNightCount +
                        (firstHalfDayCount * 0.5) +
                        (secondHalfDayCount * 0.5) +
                     //   (halfDayCount * 0.5) +
                        (halfNightCount * 0.5) +
                        (doubleNightCount * 2);

                    // ✅ Monthly Chart Data
                    var monthlyDays = workEntries
                        .GroupBy(w => new { w.Date.Year, w.Date.Month })
                        .Select(g => new MonthlyTotalDaysResponse
                        {
                            Month = $"{g.Key.Year}-{g.Key.Month:00}",

                            TotalDays = g.Sum(x =>
                                x.ShiftType == ShiftType.Day ? 1 :
                                x.ShiftType == ShiftType.FullNight ? 1 :
                                x.ShiftType == ShiftType.FirstHalfDay ? 0.5 :
                                x.ShiftType == ShiftType.SecondHalfDay ? 0.5 :                               
                                x.ShiftType == ShiftType.HalfNight ? 0.5 :
                                x.ShiftType == ShiftType.DoubleNight ? 2 : 0
                            )
                        })
                        .OrderBy(x => x.Month)
                        .ToList();

                    // ✅ Final Response
                    result.IsSuccess = true;

                    result.Value = new WorkerDashboardResponse
                    {
                        WorkerId = workerId,

                        StartDate = startDate,

                        EndDate = endDate,

                        TotalShifts = totalShifts,

                        TotalDays = totalDays,

                        TotalSalary = totalSalary,

                        TotalAdvance = totalAdvance,

                        Balance = totalSalary - totalAdvance,

                        ShiftCounts = new ShiftCountResponse
                        {
                            Day = dayCount,

                            FullNight = fullNightCount,

                            FirstHalfDay = firstHalfDayCount,

                            SecondHalfDay = secondHalfDayCount,

                           // HalfDay = halfDayCount,

                            HalfNight = halfNightCount,

                            DoubleNight = doubleNightCount
                        },

                        MonthlyTotalDays = monthlyDays,

                        WorkEntries = workEntries
                            .Select(w => new WorkEntryResponse
                            {
                                Id = w.UserId,

                                Date = w.Date,

                                ShiftType = w.ShiftType,

                                StartTime = w.StartTime,

                                EndTime = w.EndTime,

                                Salary = w.Salary
                            })
                            .ToList(),

                        AdvancePayments = advances
                            .Select(a => new AdvancePaymentResponse
                            {
                                Id = a.AdvancePaymentId,

                                Date = a.Date,

                                Amount = a.Amount,                                
                            })
                            .ToList()
                    };

                    result.ExceptionInfo = "Dashboard retrieved successfully.";
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ErrorMessageKey = "ErrorRetrievingDashboard";
                result.ExceptionInfo = ex.Message;
                result.Value = null;
            }

            return result;
        }

        public APIResult<List<AttendanceModel>> IsExistShiftTypeAttendanceGetById(int UserId, DateTime date)
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<AttendanceModel>> result = new APIResult<List<AttendanceModel>>();
                try
                {
                    var attendances = dbContext.Attendances
                        .Where(a => a.UserId == UserId && a.Date == date)
                        .Select(a => new AttendanceModel
                        {
                            AttendanceId = a.AttendanceId,
                            UserId = a.UserId,
                            Date = a.Date,
                            StartTime = a.StartTime,
                            EndTime = a.EndTime,
                            ShiftType = a.ShiftType,
                            Salary = a.Salary,
                            Status = a.Status,
                            ApporveById = a.ApporveById,
                            Latitude = a.Latitude,
                            Longitude = a.Longitude,
                            ClockInTime = a.ClockInTime,
                            ClockOutTime = a.ClockOutTime
                        }).ToList();
                    result.IsSuccess = true;
                    result.Value = attendances;
                    result.ExceptionInfo = "Attendances retrieved successfully.";
                    return result;
                }
                catch (Exception ex)
                {
                    // Log the exception (not implemented here)
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ErrorMessageKey = "ErrorRetrievingAttendances";
                    result.ExceptionInfo = ex.Message;
                    return result;
                }
            }
        }

        public APIResult<string> MarkAttendance(AttendanceRequestModel attendanceRequestModel)
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<string> result = new APIResult<string>();
                try
                {
                    var attendance = new tblAttendance
                    {
                        UserId = attendanceRequestModel.UserId,
                        Date = attendanceRequestModel.Date,
                        StartTime = attendanceRequestModel.StartTime,
                        EndTime = attendanceRequestModel.EndTime,
                        ShiftType = attendanceRequestModel.ShiftType,
                        Salary = attendanceRequestModel.Salary ?? 0,
                        Status = attendanceRequestModel.Status ?? false,
                        ApporveById = attendanceRequestModel.ApporveById ?? 0,
                        Latitude = attendanceRequestModel.Latitude,
                        Longitude = attendanceRequestModel.Longitude,
                        ClockInTime = attendanceRequestModel.ClockInTime,
                        ClockOutTime = attendanceRequestModel.ClockOutTime
                    };
                    dbContext.Attendances.Add(attendance);
                    dbContext.SaveChanges();

                    // Create Audit Log
                    var auditLog = new tblAuditLog
                    {
                        EntityName = "Attendance",
                        EntityId = attendance.AttendanceId.ToString(),
                        ActionType = "Create",
                        OriginalValue = null,
                        NewValue = System.Text.Json.JsonSerializer.Serialize(attendanceRequestModel),
                        ChangedBy = attendanceRequestModel.UserId.ToString(),
                        Timestamp = DateTime.UtcNow
                    };
                    dbContext.AuditLogs.Add(auditLog);
                    dbContext.SaveChanges();

                    result.IsSuccess = true;
                    result.Value = attendance.AttendanceId.ToString(); ;
                    result.ExceptionInfo = "Attendance marked successfully.";
                    return result;

                }
                catch (Exception ex)
                {
                    // Log the exception (not implemented here)
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ErrorMessageKey = "ErrorMarkingAttendance";
                    result.ExceptionInfo = ex.Message;
                    return result;
                }
            }
        }
        public APIResult<string> ApprovalAttendanceByManagerBatch(ApprovalBatchModel model)
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<string> result = new APIResult<string>();
                try
                {
                    if (model.AttendanceIds == null || !model.AttendanceIds.Any())
                    {
                        result.IsSuccess = false;
                        result.ErrorMessageKey = "NoAttendanceIdsProvided";
                        result.ExceptionInfo = "No attendance IDs were provided for approval.";
                        return result;
                    }

                    var attendances = dbContext.Attendances
                        .Where(a => model.AttendanceIds.Contains(a.AttendanceId))
                        .ToList();

                    if (!attendances.Any())
                    {
                        result.IsSuccess = false;
                        result.ErrorMessageKey = "AttendancesNotFound";
                        result.ExceptionInfo = "No matching attendance records found.";
                        return result;
                    }

                    foreach (var attendance in attendances)
                    {
                        var originalStatus = attendance.Status;
                        var originalApprover = attendance.ApporveById;

                        attendance.Status = true;
                        attendance.ApporveById = model.ManagerId;

                        // Create Audit Log for each approval
                        var auditLog = new tblAuditLog
                        {
                            EntityName = "Attendance",
                            EntityId = attendance.AttendanceId.ToString(),
                            ActionType = "Approve",
                            OriginalValue = $"Status: {originalStatus}, ApprovedBy: {originalApprover}",
                            NewValue = $"Status: True, ApprovedBy: {model.ManagerId}",
                            ChangedBy = model.ManagerId.ToString(),
                            Timestamp = DateTime.UtcNow
                        };
                        dbContext.AuditLogs.Add(auditLog);
                    }

                    dbContext.SaveChanges();

                    result.IsSuccess = true;
                    result.Value = $"{attendances.Count} attendance record(s) approved successfully.";
                    result.ExceptionInfo = "Batch approval completed.";
                    return result;
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ErrorMessageKey = "ErrorApprovingAttendance";
                    result.ExceptionInfo = ex.Message;
                    return result;
                }
            }
        }

        public APIResult<List<AttendanceModel>> GetAllAttendances()
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<AttendanceModel>> result = new APIResult<List<AttendanceModel>>();
                try
                {
                    var attendances = dbContext.Attendances
                        .Select(a => new AttendanceModel
                        {
                            AttendanceId = a.AttendanceId,
                            UserId = a.UserId,
                            Date = a.Date,
                            StartTime = a.StartTime,
                            EndTime = a.EndTime,
                            ShiftType = (ShiftType)a.ShiftType,
                            Salary = a.Salary,
                            Status = a.Status,
                            ApporveById = a.ApporveById,
                            Latitude = a.Latitude,
                            Longitude = a.Longitude,
                            ClockInTime = a.ClockInTime,
                            ClockOutTime = a.ClockOutTime
                        }).ToList();
                    result.IsSuccess = true;
                    result.Value = attendances;
                    result.ExceptionInfo = "Attendances retrieved successfully.";
                    return result;
                }
                catch (Exception ex)
                {
                    // Log the exception (not implemented here)
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ErrorMessageKey = "ErrorRetrievingAttendances";
                    result.ExceptionInfo = ex.Message;
                    return result;
                }
            }
        }
    }
}
