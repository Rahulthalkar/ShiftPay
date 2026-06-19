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
        private readonly IEmailRepository _emailRepository;
        public AccountService(IConfiguration configuration, IAccountRepository accountRepository, IEmailRepository emailRepository)
        {
            _configuration = configuration;
            _accountRepository = accountRepository;
            _emailRepository = emailRepository;
        }

        public APIResult<bool> ForgotPassword(ResetReqestModel resetReqestModel)
        {
            try
            {
                var isEmailValid = _accountRepository.ValidateEmail(resetReqestModel.Email);
                if (isEmailValid == null || !isEmailValid.IsSuccess || isEmailValid.Value == null)
                {
                    return new APIResult<bool> { IsSuccess = false, Value = false, ErrorMessageKey = "Invalid email address." };
                }

                // Create reset record (returns GUID + OTP)
                var creationResult = _accountRepository.RequestPasswordReset(isEmailValid.Value.Id, resetReqestModel.Email, resetReqestModel.BaseUrl);
                if (creationResult == null || !creationResult.IsSuccess || creationResult.Value == null)
                {
                    return new APIResult<bool> { IsSuccess = false, Value = false, ErrorMessageKey = "Failed to create reset record." };
                }

                // Send email using email configuration from DB
                var emailCfgResult = _emailRepository.GetEmailConfiguration();
                if (emailCfgResult == null || !emailCfgResult.IsSuccess || emailCfgResult.Value == null)
                {
                    // Email config missing; reset record exists so return success but inform via ExceptionInfo
                    return new APIResult<bool> { IsSuccess = true, Value = true, ExceptionInfo = "Reset created but email configuration missing." };
                }

                try
                {
                    var cfg = emailCfgResult.Value;
                    var smtpHost = cfg.Host ?? string.Empty;
                    var smtpPort = cfg.Port != 0 ? cfg.Port : 25;
                    var smtpUser = cfg.UserName ?? string.Empty;
                    var smtpPass = cfg.Password ?? string.Empty;
                    var enableSsl = cfg.UseSSL;

                    using (var client = new System.Net.Mail.SmtpClient(smtpHost, smtpPort))
                    {
                        client.UseDefaultCredentials = false;
                        client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                        if (!string.IsNullOrEmpty(smtpUser))
                        {
                            client.Credentials = new System.Net.NetworkCredential(smtpUser, smtpPass);
                        }
                        client.EnableSsl = enableSsl;

                        var msg = new System.Net.Mail.MailMessage();
                        msg.To.Add(resetReqestModel.Email);
                        msg.Subject = "Password Reset";
                        msg.Body = $"Your OTP is: {creationResult.Value.OTP}\nReset Link: {resetReqestModel.BaseUrl}/reset-password/{creationResult.Value.ResetGuid}";
                        msg.From = new System.Net.Mail.MailAddress(smtpUser ?? "no-reply@local", cfg.DisplayName ?? string.Empty);

                        client.Send(msg);
                    }
                }
                catch
                {
                    // swallow email exceptions; the reset record was created
                }

                return new APIResult<bool> { IsSuccess = true, Value = true, ExceptionInfo = "success" };
            }
            catch (Exception ex)
            {
                return new APIResult<bool> { IsSuccess = false, Value = false, ExceptionInfo = ex.Message };
            }
        }
        public APIResult<UserExistsResponseModel> IsValidateResetPasswordGUID(Guid guid)
        {
            var result = new APIResult<UserExistsResponseModel>();
            try
            {
                var repoResult = _accountRepository.IsValidateResetPasswordGUID(guid);
                if (repoResult == null || !repoResult.IsSuccess || repoResult.Value == null)
                {
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ErrorMessageKey = "Invalid reset password GUID.";
                    result.ExceptionInfo = repoResult?.ExceptionInfo ?? "GUID validation failed.";
                    return result;
                }

                result.IsSuccess = true;
                result.Value = repoResult.Value;
                result.ExceptionInfo = "success";
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = null;
                result.ErrorMessageKey = "An error occurred while validating the reset password GUID.";
                result.ExceptionInfo = ex.Message;
                return result;
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
