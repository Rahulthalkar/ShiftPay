using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.BAL
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserService(IConfiguration configuration, IUserRepository userRepository)
        {
            _configuration = configuration;
            _userRepository = userRepository;
        }

        public APIResult<bool> CreateUser(UserRequestModel userModel)
        {
            var result = new APIResult<bool>();
            try
            {
                result = _userRepository.CreateUser(userModel);
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = false;
                result.ErrorMessageKey = "An error occurred while creating the user.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<bool> UpdateUser(UserUpdateModel userModel)
        {
            var result = new APIResult<bool>();
            try
            {
                result = _userRepository.UpdateUser(userModel);
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = false;
                result.ErrorMessageKey = "An error occurred while creating the user.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<UserListResponseModel> GetUserById(int id)
        {
            var result = new APIResult<UserListResponseModel>();
            try
            {
                result = _userRepository.GetUserById(id);
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = null;
                result.ErrorMessageKey = "An error occurred while fetching the user.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<List<UserListResponseModel>> GetAllUsers()
        {
            var result = new APIResult<List<UserListResponseModel>>();
            try
            {
                result = _userRepository.GetAllUsers();
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = null;
                result.ErrorMessageKey = "An error occurred while fetching the users.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<List<roleResponseModel>> GetAllRoles()
        {
            var result = new APIResult<List<roleResponseModel>>();
            try
            {
                result = _userRepository.GetAllRoles();
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = null;
                result.ErrorMessageKey = "An error occurred while fetching the roles.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }
    }
}
