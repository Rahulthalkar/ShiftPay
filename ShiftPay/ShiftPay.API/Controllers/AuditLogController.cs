using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShiftPay.BAL;
using ShiftPay.Domain.Model;
using System.Collections.Generic;

namespace ShiftPay.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "1")]
    public class AuditLogController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AuditLogService _auditLogService;

        public AuditLogController(IConfiguration configuration, AuditLogService auditLogService)
        {
            _configuration = configuration;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("GetAllAuditLogs")]
        public IActionResult GetAllAuditLogs()
        {
            var result = _auditLogService.GetAllAuditLogs();
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
    }
}
