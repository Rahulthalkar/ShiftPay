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
    }
}
