using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShiftPay.BAL;
using ShiftPay.Domain.Model;

namespace ShiftPay.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        public IActionResult CreateAttendance([FromBody] AttendanceRequestModel attendanceRequestModel)
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
    }
}
