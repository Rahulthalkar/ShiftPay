using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShiftPay.BAL;
using ShiftPay.Domain.Model;

namespace ShiftPay.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly AttendanceService attendanceService;

        public AttendanceController(IConfiguration configuration, AttendanceService attendanceService)
        {
            this.configuration = configuration;
            this.attendanceService = attendanceService;
        }

        [HttpPost]
        [Route("CreateAttendance")]
        public IActionResult CreateAttendance(AttendanceRequestModel attendanceRequestModel)
        {
            var result = attendanceService.MarkAttendance(attendanceRequestModel);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet]
        [Route("GetAttendancesByUserId/{userId}")]
        public IActionResult GetAttendancesByUserId(int userId)
        {
            var result = attendanceService.GetAttendancesByUserIdAsync(userId);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        [HttpGet]
        [Route("GetDashboardByWorkerFilter")]
        public IActionResult GetDashboardByWorkerFilter(int userId, DateTime startDate, DateTime endDate)
        {
            var result = attendanceService.GetDashboardByWorkerFilter(userId, startDate, endDate);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("GetAllWorkerBySupervisorId")]
        public IActionResult GetAllWorkerBySupervisorId(int SupervisorId)
        {
            var result = attendanceService.GetAllWorkerBySupervisorId(SupervisorId);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        [HttpPost("ApprovalAttendanceByManagerBatch")]
        public IActionResult ApprovalAttendanceByManagerBatch([FromBody] ApprovalBatchModel model)
        {
            var result = attendanceService.ApprovalAttendanceByManagerBatch(model);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("GetAllAttendance")]
        public IActionResult GetAllAttendance()
        {
            var result = attendanceService.GetAllAttendances();
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("ExportMonthlyAttendance")]
        public IActionResult ExportMonthlyAttendance(int year, int month)
        {
            var result = attendanceService.ExportMonthlyAttendance(year, month);
            if (!result.IsSuccess || result.Value == null)
            {
                return BadRequest(result);
            }

            var fileName = $"attendance_{year}_{month:00}.csv";
            return File(result.Value, "text/csv", fileName);
        }
    }
}
