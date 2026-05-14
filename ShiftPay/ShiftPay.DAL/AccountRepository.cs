using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL
{
    public class AccountRepository : IAccountRepository
    {
        private readonly string connectionString;

        public AccountRepository(IConfiguration configuration)
        {
            connectionString = Convert.ToString(configuration.GetSection("ConnectionStrings:DefaultConnection").Value);   
        }
        public APIResult<LoginResponse> Login(LoginDto loginModel)
        {
            using (var dbcontext = new EmpDbEntities(connectionString))
            {
                APIResult<LoginResponse> response = new APIResult<LoginResponse>();

                try
                {
                    // First fetch user by username
                    var user = dbcontext.Users
                        .FirstOrDefault(usr => usr.Username == loginModel.Username);

                    // Check user exists
                    if (user == null)
                    {
                        response.IsSuccess = false;
                        response.ExceptionInfo = "Invalid username or password.";
                        response.Value = null;

                        return response;
                    }

                    // Verify password
                    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(
                        loginModel.Password,
                        user.PasswordHash
                    );

                    if (!isPasswordValid)
                    {
                        response.IsSuccess = false;
                        response.ExceptionInfo = "Invalid username or password.";
                        response.Value = null;

                        return response;
                    }

                    // Success response
                    response.IsSuccess = true;
                    response.ExceptionInfo = "Login successful.";

                    response.Value = new LoginResponse
                    {
                        Id = user.Id,
                        FirstName = user.Name,
                        UserName = user.Username,
                        UserTypeId = user.RoleId,
                        RoleId = user.RoleId
                    };
                }
                catch (Exception ex)
                {
                    response.IsSuccess = false;
                    response.ExceptionInfo = ex.Message;
                    response.Value = null;
                }

                return response;
            }
        }

    }
}
