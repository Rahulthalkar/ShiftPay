using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL.Interface
{
    public interface IAccountRepository
    {
        public APIResult<LoginResponse> Login(LoginDto loginModel);
        public APIResult<bool> RequestPasswordReset(int userId, string email,string baseUrl);
        public APIResult<bool> ValidatePasswordResetLink(int userId);
        public APIResult<UserExistsResponseModel> IsValidateResetPasswordGUID(Guid guid);
        public APIResult<UserUpdateModel> ValidateEmail(string email);
        public APIResult<bool> ResetPassword(ResetPasswordReqestModel resetPasswordModel);
        public APIResult<bool> ChangePassword(ChangePasswordReqest changePassword);

    }
}
