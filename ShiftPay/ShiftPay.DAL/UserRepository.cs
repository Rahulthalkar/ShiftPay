using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

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

                    // Create Audit Log
                    var auditLog = new tblAuditLog
                    {
                        EntityName = "User",
                        EntityId = userEntity.Id.ToString(),
                        ActionType = "Create",
                        OriginalValue = null,
                        NewValue = System.Text.Json.JsonSerializer.Serialize(userModel),
                        ChangedBy = userModel.CreatedBy.ToString(),
                        Timestamp = DateTime.UtcNow
                    };
                    dbContext.AuditLogs.Add(auditLog);
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
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<UserListResponseModel>> result = new APIResult<List<UserListResponseModel>>();
                try
                {
                    var users = (from user in dbContext.Users
                                 join trole in dbContext.Roles on user.RoleId equals trole.Id
                                 join mgr in dbContext.Users on user.ManagerId equals mgr.Id into mgrJoin
                                 from mgr in mgrJoin.DefaultIfEmpty()
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
                                     ManagerId = user.ManagerId,
                                     ManagerName = mgr != null ? mgr.Name : string.Empty
                                 }).ToList();
                    

                    if (users == null || users.Count == 0)
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
                                      join mgr in dbContext.Users on user.ManagerId equals mgr.Id into mgrJoin
                                      from mgr in mgrJoin.DefaultIfEmpty()
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
                                          ManagerId = user.ManagerId,
                                          ManagerName = mgr != null ? mgr.Name : string.Empty
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
            using (var dbContext = new EmpDbEntities(connectionString))
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

                    // Save original state for audit logging
                    var originalState = new
                    {
                        userEntity.Username,
                        userEntity.RoleId,
                        FullName = userEntity.Name,
                        userEntity.DailyRate,
                        userEntity.ProfileImageUrl,
                        userEntity.PhoneNumber,
                        userEntity.IsActive,
                        userEntity.ManagerId
                    };

                    userEntity.Username = userModel.Username;
                    userEntity.RoleId = userModel.RoleId;
                    userEntity.Name = userModel.FullName;
                    userEntity.DailyRate = userModel.DailyRate;
                    userEntity.ProfileImageUrl = userModel.ProfileImageUrl;
                    userEntity.PhoneNumber = userModel.PhoneNumber;
                    userEntity.IsActive = userModel.IsActive;
                    userEntity.ManagerId = userModel.ManagerId;

                    dbContext.SaveChanges();

                    // Create Audit Log
                    var auditLog = new tblAuditLog
                    {
                        EntityName = "User",
                        EntityId = userEntity.Id.ToString(),
                        ActionType = "Update",
                        OriginalValue = System.Text.Json.JsonSerializer.Serialize(originalState),
                        NewValue = System.Text.Json.JsonSerializer.Serialize(userModel),
                        ChangedBy = userModel.CreatedBy.ToString(),
                        Timestamp = DateTime.UtcNow
                    };
                    dbContext.AuditLogs.Add(auditLog);
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

        public APIResult<List<roleResponseModel>> GetAllRoles()
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<roleResponseModel>> result = new APIResult<List<roleResponseModel>>();
                try
                {
                    var roles = (from role in dbContext.Roles
                                 select new roleResponseModel
                                 {
                                     Id = role.Id,
                                     RoleName = role.Role
                                 }).ToList();
                    result.Value = roles;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = null;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorRetrievingRoles";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }

        public APIResult<List<UserListResponseModel>> GetWorkersBySupervisorId(int supervisorId)
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<UserListResponseModel>> result = new APIResult<List<UserListResponseModel>>();
                try
                {
                    // left join to include manager name
                    var workers = (from user in dbContext.Users
                                   join trole in dbContext.Roles on user.RoleId equals trole.Id
                                   join mgr in dbContext.Users on user.ManagerId equals mgr.Id into mgrJoin
                                   from mgr in mgrJoin.DefaultIfEmpty()
                                   where user.ManagerId == supervisorId
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
                                       ManagerId = user.ManagerId,
                                       ManagerName = mgr != null ? mgr.Name : string.Empty
                                   }).ToList();
                    if (workers == null || workers.Count == 0)
                    {
                        result.Value = null;
                        result.IsSuccess = false;
                        result.ExceptionInfo = "";
                        return result;
                    }
                    result.Value = workers;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = null;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorRetrievingWorkers";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }
    }
}
