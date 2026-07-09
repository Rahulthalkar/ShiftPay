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
    public class UserController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly UserService userService;
        public UserController(IConfiguration configuration, UserService userService)
        {
            this.configuration = configuration;
            this.userService = userService;
        }

        [HttpPost]
        [Route("CreateUser")]
        [Authorize(Roles = "1")]
        public IActionResult CreateUser(UserRequestModel userModel)
        {
            var result = userService.CreateUser(userModel);
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
        [Route("UpdateUser")]
        [Authorize(Roles = "1")]
        public IActionResult UpdateUser(UserUpdateModel userModel)
        {
            var result = userService.UpdateUser(userModel);
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
        [Route("GetUserById")]
        public IActionResult GetUserById(int id)
        {
            var result = userService.GetUserById(id);
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
        [Route("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            var result = userService.GetAllUsers();
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
        [Route("GetAllRoles")]
        public IActionResult GetAllRoles()
        {
            var result = userService.GetAllRoles();
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpGet("GetWorkersBySupervisorId")]
        public IActionResult GetWorkersBySupervisorId(int supervisorId)
        {
            {
                var result = userService.GetWorkersBySupervisorId(supervisorId);
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
}
