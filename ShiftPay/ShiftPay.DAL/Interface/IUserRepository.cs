using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL.Interface
{
    public interface IUserRepository
    {
         public APIResult<bool> CreateUser(UserRequestModel userModel);
         public APIResult<UserListResponseModel> GetUserById(int id);
         public APIResult<List<UserListResponseModel>> GetAllUsers();
         public APIResult<bool> UpdateUser(UserUpdateModel userModel);
         public APIResult<bool> DeleteUser(int id);
         public APIResult<List<roleResponseModel>> GetAllRoles();
         public APIResult<List<UserListResponseModel>> GetWorkersBySupervisorId(int supervisorId);

    }
}
