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
    public class AdvanceController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AdvanceService _advanceService;
        public AdvanceController(IConfiguration configuration, AdvanceService advanceService)
        {
            _configuration = configuration;
            _advanceService = advanceService;
        }
        [HttpGet]
        [Route("GetAdvanceById")]
        public IActionResult GetAdvanceById(int userId)
        {
            var result = _advanceService.GetAdvanceById(userId);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpPost]
        [Route("CreateAdvance")]
        public IActionResult CreateAdvance(AdvancePaymentModel advanceModel)
        {
            var result = _advanceService.CreateAdvance(advanceModel);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
        [HttpGet]
        [Route("GetAllAdvances")]
        public IActionResult GetAllAdvances()
        {
            var result = _advanceService.GetAllAdvances();
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
