using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL
{
    public class UserRepository : IUserRepository
    {
        private readonly string connectionString;
        public UserRepository(IConfiguration configuration)
        {
            connectionString = Convert.ToString(configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
        }

        public APIResult<bool> CreateUser(UserRequestModel userModel)
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<bool> result = new APIResult<bool>();
                try
                {
                    var userEntity = new tblUser
                    {
                        Username = userModel.Username,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(userModel.PasswordHash),
                        RoleId = userModel.RoleId,
                        Name = userModel.FullName,
                        DailyRate = userModel.DailyRate,
                        ProfileImageUrl = userModel.ProfileImageUrl,
                        PhoneNumber = userModel.PhoneNumber,
                        IsActive = userModel.IsActive,
                        ManagerId = userModel.ManagerId,
                        CreatedBy = userModel.CreatedBy,
                        CreatedAt = DateTime.UtcNow
                    };
                    dbContext.Users.Add(userEntity);
                    dbContext.SaveChanges();
                    result.Value = true;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    
                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = false;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorCreatingUser";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }

        public APIResult<bool> DeleteUser(int id)
        {
            throw new NotImplementedException();
        }

        public APIResult<List<UserListResponseModel>> GetAllUsers()
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<UserListResponseModel>> result = new APIResult<List<UserListResponseModel>>();
                try
                {
                    var users = (from user in dbContext.Users
                                 join trole in dbContext.Roles on user.RoleId equals trole.Id
                                 select new UserListResponseModel
                                 {
                                     Id = user.Id,
                                     Username = user.Username,
                                     RoleId = user.RoleId,
                                     RoleName = trole.Role,
                                     FullName = user.Name,
                                     DailyRate = user.DailyRate,
                                     ProfileImageUrl = user.ProfileImageUrl,
                                     PhoneNumber = user.PhoneNumber,
                                     IsActive = user.IsActive,
                                     ManagerId = user.ManagerId
                                 }).ToList();
                    if (users==null || users.Count == 0)
                    {
                        result.Value = null;
                        result.IsSuccess = false;
                        result.ExceptionInfo = "";
                        return result;
                    }
                    result.Value = users;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = null;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorRetrievingUsers";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }

        public APIResult<UserListResponseModel> GetUserById(int id)
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<UserListResponseModel> result = new APIResult<UserListResponseModel>();
                try
                {
                    var userEntity = (from user in dbContext.Users
                                      join trole in dbContext.Roles on user.RoleId equals trole.Id
                                      where user.Id == id
                                      select new UserListResponseModel
                                      {
                                          Id = user.Id,
                                          Username = user.Username,
                                          RoleId = user.RoleId,
                                          RoleName = trole.Role,
                                          FullName = user.Name,
                                          DailyRate = user.DailyRate,
                                          ProfileImageUrl = user.ProfileImageUrl,
                                          PhoneNumber = user.PhoneNumber,
                                          IsActive = user.IsActive,
                                          ManagerId = user.ManagerId
                                      }).FirstOrDefault();

                    if (userEntity == null)
                    {
                        result.Value = null;
                        result.IsSuccess = false;
                        result.ErrorMessageKey = "UserNotFound";
                        return result;
                    }
                     
                   
                    result.Value = userEntity;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = null;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorRetrievingUser";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }

        public APIResult<bool> UpdateUser(UserUpdateModel userModel)
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<bool> result = new APIResult<bool>();
                try
                {
                    var userEntity = dbContext.Users.FindAsync(userModel.Id).Result;
                    if (userEntity == null)
                    {
                        result.Value = false;
                        result.IsSuccess = false;
                        result.ErrorMessageKey = "UserNotFound";
                        return result;
                    }
                    userEntity.Username = userModel.Username;                  
                    userEntity.RoleId = userModel.RoleId;
                    userEntity.Name = userModel.FullName;
                    userEntity.DailyRate = userModel.DailyRate;
                    userEntity.ProfileImageUrl = userModel.ProfileImageUrl;
                    userEntity.PhoneNumber = userModel.PhoneNumber;
                    userEntity.IsActive = userModel.IsActive;
                    userEntity.ManagerId = userModel.ManagerId;   
                    
                    dbContext.SaveChanges();
                    result.Value = true;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";

                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = false;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorUpdatingUser";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }
    }
}
