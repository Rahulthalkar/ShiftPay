using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json.Serialization;

namespace ShiftPay.Domain.Model
{
    public class UserRequestModel
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string FullName { get; set; }
        public decimal DailyRate { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public int? ManagerId { get; set; }
        public int CreatedBy { get; set; }
    }
    public class UserUpdateModel
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string FullName { get; set; }
        public decimal DailyRate { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public int? ManagerId { get; set; }
        public int CreatedBy { get; set; }
        //public int UpdatedBy { get; set; }
    }
    public class UserResponseModel
    {
        public string Username { get; set; }
        public int RoleId { get; set; }
        public string FullName { get; set; }
        public decimal DailyRate { get; set; }
        public string? PhoneNumber { get; set; }

    }

    public class UserListResponseModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string FullName { get; set; }
        public decimal DailyRate { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public int? ManagerId { get; set; }
        public string ManagerName { get; set; }
    }
    public enum ShiftType
    {
        Day,
        FirstHalfDay,
        SecondHalfDay,
        HalfNight,
        FullNight,
        DoubleNight
    }
    public class LoginResponse
    {
        /// <summary>
        /// User Id
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// User FirstName
        /// </summary>
        public string FirstName { get; set; }
        /// <summary>
        /// User UserName
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// UserEmail
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// RoleId
        /// </summary>
        public int RoleId { get; set; }

        /// <summary>
        /// OrganizationId
        /// </summary>
        public int? CompanyId { get; set; }

        /// <summary>
        /// ManagerId
        /// </summary>
        public int? ManagerId { get; set; }

        /// <summary>
        /// User Type Id
        /// </summary>
        public int? UserTypeId { get; set; }

        /// <summary>
        /// ExpiresIn
        /// </summary>
        public double ExpiresIn { get; set; }

        /// <summary>
        /// JWT Bearer Token
        /// </summary>
        public string? Token { get; set; }
    }
    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    public class APIResult<T>
    {
        public APIResult() { }
        [DataMember]
        public T? Value { get; set; }

        /// <summary>
        /// This is what helps us decide whether the business logic executed successfully or not.
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// This value needs to be translated, hence they need to be present in the resource files.
        /// </summary>
        public string ErrorMessageKey { get; set; } = string.Empty;

        /// <summary>
        /// Serialized Exception Information.
        /// </summary>
        public string ExceptionInfo { get; set; } = string.Empty;


    }

    public class roleResponseModel
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
    }


    public class ResetPasswordDto
    {
        public int UserId { get; set; }
        public string email { get; set; }
        public string OTP { get; set; }
        public DateTime CreatedDate { get; set; }


    }
    public class ResetPasswordReqestModel
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public Guid ResetPasswordGuid { get; set; }        
        public string NewPassword { get; set; }
    }
    public class ResetReqestModel
    {
       
        public string Email { get; set; }    

        public string? BaseUrl { get; set; }
    }

    public class ChangePasswordReqest
    {
        public int UserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public DateTime CreatedDate { get; set; }


    }
}
