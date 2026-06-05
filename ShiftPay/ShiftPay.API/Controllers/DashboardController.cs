using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShiftPay.BAL;
using ShiftPay.Domain.Model;
using Microsoft.Extensions.Configuration;

namespace ShiftPay.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "1")]
    public class DashboardController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DashboardService _dashboardService;

        public DashboardController(IConfiguration configuration, DashboardService dashboardService)
        {
            _configuration = configuration;
            _dashboardService = dashboardService;
        }

        [HttpGet]
        [Route("GetAdminDashboardStats")]
        public IActionResult GetAdminDashboardStats()
        {
            var result = _dashboardService.GetAdminDashboardStats();
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
