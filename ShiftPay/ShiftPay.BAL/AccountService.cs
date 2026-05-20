using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.BAL
{
    public class AccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IConfiguration _configuration;
        public AccountService(IConfiguration configuration, IAccountRepository accountRepository)
        {
            _configuration = configuration;
            _accountRepository = accountRepository;
        }

        public APIResult<LoginResponse> Login(LoginDto loginModel)
        {
             var result = new APIResult<LoginResponse>();
            try
            {
                
                var user = _accountRepository.Login(loginModel);               

                if (user.IsSuccess)
                {
                    result.IsSuccess = true;
                    result.Value = user.Value;
                    result.ExceptionInfo = "success";                   
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "Invalid username or password.";                   
                }
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = null; 
                result.ErrorMessageKey = "An error occurred during login.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

    }
}
