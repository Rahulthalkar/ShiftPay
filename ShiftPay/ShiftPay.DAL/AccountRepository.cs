using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;
using System.Net.Mail;

namespace ShiftPay.DAL
{
    public class AccountRepository : IAccountRepository
    {
        private readonly string connectionString;

        public AccountRepository(IConfiguration configuration)
        {
            connectionString = Convert.ToString(configuration.GetSection("ConnectionStrings:DefaultConnection").Value);   
        }

        public APIResult<bool> RequestPasswordReset(int userId, string email,string baseUrl)
        {
            using (var dbcontext = new EmpDbEntities(connectionString))
            {
                var result = new APIResult<bool>();
                try
                {
                    // validate email format
                    if (!IsValidEmail(email))
                    {
                        result.IsSuccess = false;
                        result.Value = false;
                        result.ErrorMessageKey = "InvalidEmail";
                        result.ExceptionInfo = "Provided email is not valid.";
                        return result;
                    }

                    // generate guid and otp
                    var guid = Guid.NewGuid();
                    var rnd = new Random();
                    var otp = rnd.Next(100000, 999999).ToString();

                    var resetEntity = new tblReset
                    {
                        UserId = userId,
                        PasswordChangesGuid = guid,                      
                        IsUsed = false,
                        CreatedAt = DateTime.UtcNow,
                        ExpiresAt = DateTime.UtcNow.AddMinutes(15)
                    };

                    dbcontext.Add(resetEntity);
                    dbcontext.SaveChanges();

                    // send email (best-effort)
                    try
                    {
                        // read basic settings from configuration via connection string object is not available here; fallback to appsettings in Program-level send
                        var smtpHost = "smtp.gmail.com";
                        var smtpPort = 587;
                        var smtpUser = "rahulthalkar.akkomplish@gmail.com";
                        var smtpPass = "mxkk siew pkfs mbkv";

                        // try to read environment variables as a fallback
                        smtpHost = System.Environment.GetEnvironmentVariable("SMTP_HOST") ?? smtpHost;
                        var portStr = System.Environment.GetEnvironmentVariable("SMTP_PORT");
                        if (!string.IsNullOrEmpty(portStr) && int.TryParse(portStr, out var p)) smtpPort = p;

                        smtpUser = System.Environment.GetEnvironmentVariable("SMTP_USER") ?? smtpUser;
                        smtpPass = System.Environment.GetEnvironmentVariable("SMTP_PASS") ?? smtpPass;

                        if (!string.IsNullOrEmpty(smtpHost))
                        {
                            using (var client = new System.Net.Mail.SmtpClient(smtpHost, smtpPort))
                            {
                                client.UseDefaultCredentials = false;
                                client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                                if (!string.IsNullOrEmpty(smtpUser))
                                {
                                    client.Credentials = new System.Net.NetworkCredential(smtpUser, smtpPass);
                                }
                                client.EnableSsl = true;

                                var msg = new System.Net.Mail.MailMessage();
                                msg.To.Add(email);
                                msg.Subject = "Password Reset OTP";
                                msg.Body = $"Your OTP is: {otp}\nReset Link: {baseUrl}/reset-password/{guid}";
                                msg.From = new System.Net.Mail.MailAddress(smtpUser ?? "no-reply@local");

                                client.Send(msg);
                            }
                        }
                    }
                    catch
                    {
                        // swallow email exceptions - operation still succeeds since reset record saved
                    }

                    result.IsSuccess = true;
                    result.Value = true;
                    result.ExceptionInfo = "success";
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Value = false;
                    result.ExceptionInfo = ex.Message;
                }

                return result;
            }
        }

        private bool IsValidEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            try
            {
                var _ = new MailAddress(email);
                return true;
            }
            catch
            {
                return false;
            }
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

        public APIResult<UserUpdateModel> ValidateEmail(string email)
        {
            using (var dbcontext = new EmpDbEntities(connectionString))
            {
                var result = new APIResult<UserUpdateModel>();
                try
                {
                    var exists = dbcontext.Users.FirstOrDefault(user => user.Username == email);
                    if (exists == null)
                    {
                        result.IsSuccess = false;
                        result.Value = null;
                        result.ExceptionInfo = "Email not found";
                        return result;
                    }

                    var userModel = new UserUpdateModel
                    {
                        Id = exists.Id,
                        Username = exists.Username,
                        RoleId = exists.RoleId,
                        FullName = exists.Name,
                        DailyRate = exists.DailyRate,
                        ProfileImageUrl = exists.ProfileImageUrl,
                        PhoneNumber = exists.PhoneNumber,
                        IsActive = exists.IsActive,
                        ManagerId = exists.ManagerId,
                        CreatedBy = exists.CreatedBy
                    };

                    result.IsSuccess = true;
                    result.Value = userModel;
                    result.ExceptionInfo = "success";
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ExceptionInfo = ex.Message;
                }
                return result;
            }
        }

        public APIResult<UserExistsResponseModel> IsValidateResetPasswordGUID(Guid guid)
        {
            using (var dbcontext = new EmpDbEntities(connectionString))
            {
                var result = new APIResult<UserExistsResponseModel>();
                try
                {
                    var resetRecord = dbcontext.Resets.FirstOrDefault(r => r.PasswordChangesGuid == guid);
                    if (resetRecord == null || resetRecord.IsUsed || resetRecord.ExpiresAt < DateTime.UtcNow)
                    {
                        result.IsSuccess = false;
                        result.Value = null;
                        result.ExceptionInfo = "Invalid or expired reset link.";
                        return result;
                    }                   
                    var user = dbcontext.Users.FirstOrDefault(u => u.Id == resetRecord.UserId);
                    UserExistsResponseModel userModel = new UserExistsResponseModel
                    {
                        Id = user.Id,
                        FirstName = user.Name,
                        UserName = user.Username,
                        IsActive = user.IsActive,
                        Password = user.PasswordHash,
                        Email = user.Username,
                        UserTypeId = user.RoleId
                    };
                    result.IsSuccess = true;
                    result.Value = userModel;
                    result.ExceptionInfo = "success";
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Value = null;
                    result.ExceptionInfo = ex.Message;
                }
                return result;
            }
    }

        public APIResult<bool> ResetPassword(ResetPasswordReqestModel resetPasswordModel)
        {
            using(var dbcontext = new EmpDbEntities(connectionString))
            {
                var result = new APIResult<bool>();
                try
                {
                    var resetRecord = dbcontext.Resets.FirstOrDefault(r => r.PasswordChangesGuid == resetPasswordModel.ResetPasswordGuid 
                    && r.UserId==resetPasswordModel.UserId);

                    if (resetRecord == null || resetRecord.IsUsed || resetRecord.ExpiresAt < DateTime.UtcNow)
                    {
                        result.IsSuccess = false;
                        result.Value = false;
                        result.ExceptionInfo = "Invalid or expired reset link.";
                        return result;
                    }
                    var user = dbcontext.Users.FirstOrDefault(u => u.Id == resetPasswordModel.UserId);
                    if (user == null)
                    {
                        result.IsSuccess = false;
                        result.Value = false;
                        result.ExceptionInfo = "User not found.";
                        return result;
                    }
                    // Update password
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordModel.NewPassword);
                    resetRecord.IsUsed = true;
                    dbcontext.SaveChanges();
                    result.IsSuccess = true;
                    result.Value = true;
                    result.ExceptionInfo = "Password reset successful.";
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Value = false;
                    result.ExceptionInfo = ex.Message;
                }
                return result;
           
        }
    }

        public APIResult<bool> ValidatePasswordResetLink(int userId)
        {
            using (var dbcontext = new EmpDbEntities(connectionString))
            {
                var result = new APIResult<bool>();
                try
                {
                    var resetRecords = (from rst in dbcontext.Resets 
                                        where rst.IsUsed == false && rst.UserId == userId 
                                        select rst).ToList();

                    if (resetRecords != null && resetRecords.Count > 0)
                    {
                        foreach (var record in resetRecords)
                        {
                            record.IsUsed = true;
                        }
                        dbcontext.SaveChanges();
                    }
                    
                    result.IsSuccess = true;
                    result.Value = true;
                    result.ExceptionInfo = "Valid reset link exists.";
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Value = false;
                    result.ExceptionInfo = ex.Message;
                }
                return result;
            }
        }

        public APIResult<bool> ChangePassword(ChangePasswordReqest changePassword)
        {
            using(var dbcontext = new EmpDbEntities(connectionString))
            {
                var result = new APIResult<bool>();
                try
                {
                    var user = dbcontext.Users.FirstOrDefault(u => u.Id == changePassword.UserId);
                    if (user == null)
                    {
                        result.IsSuccess = false;
                        result.Value = false;
                        result.ExceptionInfo = "User not found.";
                        return result;
                    }
                    // Verify old password
                    bool isOldPasswordValid = BCrypt.Net.BCrypt.Verify(changePassword.OldPassword, user.PasswordHash);
                    if (!isOldPasswordValid)
                    {
                        result.IsSuccess = false;
                        result.Value = false;
                        result.ExceptionInfo = "Old password is incorrect.";
                        return result;
                    }
                    // Update to new password
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePassword.NewPassword);
                    dbcontext.SaveChanges();
                    result.IsSuccess = true;
                    result.Value = true;
                    result.ExceptionInfo = "Password changed successfully.";
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Value = false;
                    result.ExceptionInfo = ex.Message;
                }
                return result;
            }
        }
    }
}  
