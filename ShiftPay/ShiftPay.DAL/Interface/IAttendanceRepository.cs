using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL.Interface
{
    public interface IAttendanceRepository
    {
        public APIResult<List<AttendanceModel>> GetAttendancesByUserIdAsync(int userId);
        public APIResult<string> MarkAttendance(AttendanceRequestModel attendanceRequestModel);
        public APIResult<List<AttendanceModel>> IsExistShiftTypeAttendanceGetById(int UserId,DateTime date);
        public APIResult<WorkerDashboardResponse> GetDashboardByWorkerFilter(int workerId, DateTime? startDate, DateTime? endDate);
        //public APIResult<List<ShiftReportResponse>> GetShiftReport(DateTime startDate, DateTime endDate, int supervisorId);
        public APIResult<List<SupervisorWorkerModel>> GetAllWorkerBySupervisorId(int supervisorId);

    }
}
