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

        public APIResult<bool> ForgotPassword(ResetReqestModel resetReqestModel)
        {
            try
            {
                var isEmailValid = _accountRepository.ValidateEmail(resetReqestModel.Email);
                if (isEmailValid == null || !isEmailValid.IsSuccess)
                {
                    return new APIResult<bool> { IsSuccess = false, Value = false, ErrorMessageKey = "Invalid email address." };
                }

                var isValidUser = _accountRepository.ValidatePasswordResetLink(isEmailValid.Value.Id);
                if (isValidUser.IsSuccess)
                {
                    return _accountRepository.RequestPasswordReset(isEmailValid.Value.Id, resetReqestModel.Email, resetReqestModel.BaseUrl);
                }

                return isValidUser;
            }
            catch (Exception ex)
            {
                return new APIResult<bool> { IsSuccess = false, Value = false, ExceptionInfo = ex.Message };
            }
        }
        public APIResult<bool> IsValidateResetPasswordGUID(Guid guid)
        {
            try
            {
                var isGuidValid = _accountRepository.IsValidateResetPasswordGUID(guid);
                if (isGuidValid == null || !isGuidValid.IsSuccess)
                {
                    return new APIResult<bool> { IsSuccess = false, Value = false, ErrorMessageKey = "InvalidGuidID." };
                }                

                return new APIResult<bool>
                {
                    IsSuccess = true,
                    Value = true,
                    ExceptionInfo = "success"
                };
            }
            catch (Exception ex)
            {
                return new APIResult<bool> { IsSuccess = false, Value = false, ExceptionInfo = ex.Message };
            }
        }
        public APIResult<bool> ResetPassword(ResetPasswordReqestModel resetPasswordReqest)
        {
             APIResult<bool> result = new APIResult<bool>();
            try
            {
               var isReset = _accountRepository.ResetPassword(resetPasswordReqest);
                if (isReset == null || !isReset.IsSuccess)
                {
                    result.IsSuccess = false;
                    result.Value = false;
                    result.ErrorMessageKey = "Failed to reset password.";
                }
                else
                {
                    result.IsSuccess = true;
                    result.Value = true;
                    result.ExceptionInfo = "success";
                }
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = false;
                result.ErrorMessageKey = "An error occurred while resetting the password.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
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

        public APIResult<bool> ChangePassword(ChangePasswordReqest changePassword)
        {
            var result = new APIResult<bool>();
            try
            {
                var isChanged = _accountRepository.ChangePassword(changePassword);
                if (isChanged == null || !isChanged.IsSuccess)
                {
                    result.IsSuccess = false;
                    result.Value = false;
                    result.ErrorMessageKey = "Failed to change password.";
                }
                else
                {
                    result.IsSuccess = true;
                    result.Value = true;
                    result.ExceptionInfo = "success";
                }
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = false;
                result.ErrorMessageKey = "An error occurred while changing the password.";
                result.ExceptionInfo = ex.Message;
                return result;
            }

        }
}
}
