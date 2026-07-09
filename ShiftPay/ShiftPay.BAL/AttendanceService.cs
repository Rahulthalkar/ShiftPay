using Azure;
using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.BAL
{
    public class AttendanceService
    {
        private readonly IConfiguration _configuration;
        private readonly IAttendanceRepository attendanceRepository;
        private readonly IUserRepository userRepository;
        public AttendanceService(IConfiguration configuration, IAttendanceRepository attendanceRepository, IUserRepository userRepository)
        {
            _configuration = configuration;
            this.attendanceRepository = attendanceRepository;
            this.userRepository = userRepository;
        }

        public APIResult<byte[]> ExportMonthlyAttendance(int year, int month)
        {
            var result = new APIResult<byte[]>();
            try
            {
                var attendancesResult = attendanceRepository.GetAllAttendances();
                if (!attendancesResult.IsSuccess || attendancesResult.Value == null)
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = attendancesResult.ErrorMessageKey ?? "ErrorRetrievingAttendances";
                    result.ExceptionInfo = attendancesResult.ExceptionInfo;
                    return result;
                }

                var usersResult = userRepository.GetAllUsers();
                var users = new List<Domain.Model.UserListResponseModel>();
                if (usersResult != null && usersResult.IsSuccess && usersResult.Value != null)
                {
                    users = usersResult.Value;
                }

                var filtered = attendancesResult.Value
                    .Where(a => a.Date.Year == year && a.Date.Month == month)
                    .OrderBy(a => a.UserId).ThenBy(a => a.Date)
                    .ToList();

                var sb = new System.Text.StringBuilder();
                // CSV header
                sb.AppendLine("UserId,Username,Name,Date,ShiftType,StartTime,EndTime,Salary,Status,ClockIn,ClockOut");

                foreach (var a in filtered)
                {
                    var user = users.FirstOrDefault(u => u.Id == a.UserId);
                    var username = user?.Username ?? string.Empty;
                    var name = user?.FullName ?? string.Empty;
                    var date = a.Date.ToString("yyyy-MM-dd");
                    var start = a.StartTime.ToString();
                    var end = a.EndTime.ToString();
                    var salary = a.Salary.ToString("F2");
                    var status = a.Status ? "APPROVED" : "PENDING";
                    var clockIn = a.ClockInTime.HasValue ? a.ClockInTime.Value.ToString("s") : string.Empty;
                    var clockOut = a.ClockOutTime.HasValue ? a.ClockOutTime.Value.ToString("s") : string.Empty;

                    // escape commas by wrapping fields in quotes if necessary
                    string Escape(string s) => s != null && s.Contains(",") ? '"' + s.Replace("\"", "\"\"") + '"' : s;

                    sb.AppendLine(string.Join(",",
                        a.UserId,
                        Escape(username),
                        Escape(name),
                        date,
                        a.ShiftType.ToString(),
                        start,
                        end,
                        salary,
                        status,
                        Escape(clockIn),
                        Escape(clockOut)
                    ));
                }

                var csv = sb.ToString();
                var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
                result.IsSuccess = true;
                result.Value = bytes;
                result.ExceptionInfo = "success";
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = null;
                result.ErrorMessageKey = "ErrorExportingAttendance";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<List<AttendanceModel>> GetAttendancesByUserIdAsync(int userId)
        {
            APIResult<List<AttendanceModel>> result = new APIResult<List<AttendanceModel>>();
            try
            {
                var attendancesResult = attendanceRepository.GetAttendancesByUserIdAsync(userId);
                if (attendancesResult.IsSuccess)
                {
                    result.IsSuccess = true;
                    result.Value = attendancesResult.Value;
                    result.ExceptionInfo = "Attendances retrieved successfully.";
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = attendancesResult.ErrorMessageKey;
                    result.ExceptionInfo = attendancesResult.ExceptionInfo;
                }
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ErrorMessageKey = "ErrorRetrievingAttendances";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<string> MarkAttendance(AttendanceRequestModel attendanceRequestModel)
        {
            APIResult<string> result = new APIResult<string>();

            try
            {
                var workerResult = userRepository.GetUserById(attendanceRequestModel.UserId);

                if (!workerResult.IsSuccess || workerResult.Value == null)
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "UserNotFound";
                    result.ExceptionInfo = "Worker not found.";
                    return result;
                }

                // Duration Calculation (Cross Midnight Support)
                double durationHrs = (attendanceRequestModel.EndTime - attendanceRequestModel.StartTime).TotalHours;

                if (durationHrs < 0)
                {
                    durationHrs += 24;
                }

                decimal dailyRate = workerResult.Value.DailyRate;
                decimal salary = 0;

                // Salary Calculation
                switch (attendanceRequestModel.ShiftType)
                {
                    case ShiftType.Day:
                        //salary = durationHrs < 9
                        //    ? (dailyRate / 9m) * (decimal)durationHrs
                        //    : dailyRate;
                        salary=dailyRate; // Assuming full day rate for any duration of day shift, adjust as needed
                        break;

                    case ShiftType.FirstHalfDay:
                    case ShiftType.SecondHalfDay:
                    case ShiftType.HalfNight:
                        salary = dailyRate / 2m;
                        break;

                    case ShiftType.FullNight:
                        salary = dailyRate;
                        break;

                    case ShiftType.DoubleNight:
                        salary = dailyRate * 2m;
                        break;

                    default:
                        salary = 0;
                        break;
                }

                attendanceRequestModel.Salary = salary;

                // Get Existing Shifts
                var existingShiftResult = attendanceRepository
                    .IsExistShiftTypeAttendanceGetById(
                        attendanceRequestModel.UserId,
                        attendanceRequestModel.Date);

                List<string> existingShifts = new List<string>();

                if (existingShiftResult != null && existingShiftResult.Value != null)
                {
                    existingShifts = existingShiftResult.Value.Select(x => x.ShiftType.ToString()).ToList();
                }

                // Duplicate Check
                if (existingShifts.Contains(attendanceRequestModel.ShiftType.ToString()))
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey =
                        $"Duplicate entry: {attendanceRequestModel.ShiftType} already exists.";

                    return result;
                }

                var nightShifts = new List<string>
                {
                    ShiftType.HalfNight.ToString(),
                    ShiftType.FullNight.ToString(),
                    ShiftType.DoubleNight.ToString()
                };

                var dayShifts = new List<string>
                {
                    ShiftType.Day.ToString(),
                    ShiftType.FirstHalfDay.ToString(),
                    ShiftType.SecondHalfDay.ToString(),
                };

                // Only One Night Shift Allowed
                if (nightShifts.Contains(attendanceRequestModel.ShiftType.ToString()) &&
                    existingShifts.Any(s => nightShifts.Contains(s)))
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "Night shift already exists for this date.";

                    return result;
                }

                // Full Day Blocks Other Day Shifts
                if (attendanceRequestModel.ShiftType == ShiftType.Day &&
                    existingShifts.Any(s => dayShifts.Contains(s)))
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "Day shift already exists.";

                    return result;
                }

                // Half Day Not Allowed If Full Day Exists
                if ((attendanceRequestModel.ShiftType == ShiftType.FirstHalfDay ||
                     attendanceRequestModel.ShiftType == ShiftType.SecondHalfDay) &&
                     existingShifts.Contains(ShiftType.Day.ToString()))
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "Full day already exists.";

                    return result;
                }

                // Save Attendance
                var markResult = attendanceRepository.MarkAttendance(attendanceRequestModel);

                if (markResult.IsSuccess)
                {
                    result.IsSuccess = true;
                    result.Value = markResult.Value;
                    result.ExceptionInfo = "Attendance marked successfully.";
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = markResult.ErrorMessageKey;
                    result.ExceptionInfo = markResult.ExceptionInfo;
                }

                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ErrorMessageKey = "ErrorMarkingAttendance";
                result.ExceptionInfo = ex.Message;

                return result;
            }
        }

        public APIResult<WorkerDashboardResponse> GetDashboardByWorkerFilter(int userId, DateTime startDate, DateTime endDate)
        {
            APIResult<WorkerDashboardResponse> result = new APIResult<WorkerDashboardResponse>();
            try
            {
                var attendancesResult = attendanceRepository.GetDashboardByWorkerFilter(userId, startDate, endDate);
                if (attendancesResult.IsSuccess)
                {
                    result.IsSuccess = true;
                    result.Value = attendancesResult.Value;
                    result.ExceptionInfo = "Attendances retrieved successfully.";
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = attendancesResult.ErrorMessageKey;
                    result.ExceptionInfo = attendancesResult.ExceptionInfo;
                }
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ErrorMessageKey = "ErrorRetrievingAttendances";
                result.ExceptionInfo = ex.Message;
                return result;
            }

        }

        public APIResult<List<SupervisorWorkerModel>> GetAllWorkerBySupervisorId(int supervisorId)
        {

            APIResult<List<SupervisorWorkerModel>> result = new APIResult<List<SupervisorWorkerModel>>();
            try
            {
                var attendancesResult = attendanceRepository.GetAllWorkerBySupervisorId(supervisorId);
                if (attendancesResult.IsSuccess)
                {
                    result.IsSuccess = true;
                    result.Value = attendancesResult.Value;
                    result.ExceptionInfo = "Attendances retrieved successfully.";
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = attendancesResult.ErrorMessageKey;
                    result.ExceptionInfo = attendancesResult.ExceptionInfo;
                }
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ErrorMessageKey = "ErrorRetrievingAttendances";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }
        public APIResult<string> ApprovalAttendanceByManagerBatch(ApprovalBatchModel model)
        {
            APIResult<string> result = new APIResult<string>();
            try
            {
                var approvalResult = attendanceRepository.ApprovalAttendanceByManagerBatch(model);
                if (approvalResult.IsSuccess)
                {
                    result.IsSuccess = true;
                    result.Value = approvalResult.Value;
                    result.ExceptionInfo = approvalResult.ExceptionInfo;
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = approvalResult.ErrorMessageKey;
                    result.ExceptionInfo = approvalResult.ExceptionInfo;
                }
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ErrorMessageKey = "ErrorApprovingAttendance";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<List<AttendanceModel>> GetAllAttendances()
        {
            APIResult<List<AttendanceModel>> result = new APIResult<List<AttendanceModel>>();
            try
            {
                var attendancesResult = attendanceRepository.GetAllAttendances();
                if (attendancesResult.IsSuccess)
                {
                    result.IsSuccess = true;
                    result.Value = attendancesResult.Value;
                    result.ExceptionInfo = "Attendances retrieved successfully.";
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = attendancesResult.ErrorMessageKey;
                    result.ExceptionInfo = attendancesResult.ExceptionInfo;
                }
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ErrorMessageKey = "ErrorRetrievingAttendances";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }
    }
}
