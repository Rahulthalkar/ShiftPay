using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ShiftPay.BAL;
using ShiftPay.Domain.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ShiftPay.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AccountService _accountService;

        public AccountController(IConfiguration configuration, AccountService accountService)
        {
            _configuration = configuration;
            _accountService = accountService;
        }

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginDto loginModel)
        {
            var result = _accountService.Login(loginModel);

            if (result.IsSuccess && result.Value != null)
            {
                // Generate JWT from the validated LoginResponse and embed it in the response
                result.Value.Token = GenerateJwtToken(result.Value);
                return Ok(result);
            }

            return Unauthorized(result);
        }

        private string GenerateJwtToken(LoginResponse user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                    new Claim(ClaimTypes.Role, user.RoleId.ToString()),
                    new Claim("managerId", user.ManagerId?.ToString() ?? "0")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost]
        [Route("ForgotPassword")]
        [AllowAnonymous]
        public IActionResult ForgotPassword(ResetReqestModel resetReqestModel)
        {
            var result = _accountService.ForgotPassword(resetReqestModel);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        [HttpPost]
        [Route("IsValidateResetPasswordGUID")]
        [AllowAnonymous]
        public IActionResult IsValidateResetPasswordGUID(Guid guid)
        {
            var result = _accountService.IsValidateResetPasswordGUID(guid);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        [HttpPost]
        [Route("ResetPassword")]
        [AllowAnonymous]
        public IActionResult ResetPassword(ResetPasswordReqestModel resetPasswordReqest)
        {
            var result = _accountService.ResetPassword(resetPasswordReqest);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost]
        [Route("ChangePassword")]
        public IActionResult ChangePassword(ChangePasswordReqest changePassword)
        {
            // Always change the password of the authenticated caller; never trust the
            // UserId supplied in the request body (prevents changing another user's password).
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(currentUserId, out var userId))
            {
                return Unauthorized();
            }
            changePassword.UserId = userId;

            var result = _accountService.ChangePassword(changePassword);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
   
}
