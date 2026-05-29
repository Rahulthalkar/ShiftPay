using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ShiftPay.DAL
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly string connectionString;

        public AuditLogRepository(IConfiguration configuration)
        {
            connectionString = Convert.ToString(configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
        }

        public APIResult<bool> CreateAuditLog(AuditLogRequestModel model)
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<bool> result = new APIResult<bool>();
                try
                {
                    var auditLogEntity = new tblAuditLog
                    {
                        EntityName = model.EntityName,
                        EntityId = model.EntityId,
                        ActionType = model.ActionType,
                        OriginalValue = model.OriginalValue,
                        NewValue = model.NewValue,
                        ChangedBy = model.ChangedBy,
                        Timestamp = DateTime.UtcNow
                    };

                    dbContext.AuditLogs.Add(auditLogEntity);
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
                    result.ErrorMessageKey = "ErrorCreatingAuditLog";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }

        public APIResult<List<AuditLogResponseModel>> GetAllAuditLogs()
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<AuditLogResponseModel>> result = new APIResult<List<AuditLogResponseModel>>();
                try
                {
                    var logs = dbContext.AuditLogs
                        .OrderByDescending(x => x.Timestamp)
                        .Select(log => new AuditLogResponseModel
                        {
                            Id = log.Id,
                            EntityName = log.EntityName,
                            EntityId = log.EntityId,
                            ActionType = log.ActionType,
                            OriginalValue = log.OriginalValue,
                            NewValue = log.NewValue,
                            ChangedBy = log.ChangedBy,
                            Timestamp = log.Timestamp
                        }).ToList();

                    result.Value = logs;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = null;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorRetrievingAuditLogs";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }

        public APIResult<List<AuditLogResponseModel>> GetAuditLogsByEntity(string entityName, string? entityId)
        {
            using (var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<AuditLogResponseModel>> result = new APIResult<List<AuditLogResponseModel>>();
                try
                {
                    var query = dbContext.AuditLogs.AsQueryable();

                    if (!string.IsNullOrEmpty(entityName))
                    {
                        query = query.Where(x => x.EntityName == entityName);
                    }

                    if (!string.IsNullOrEmpty(entityId))
                    {
                        query = query.Where(x => x.EntityId == entityId);
                    }

                    var logs = query
                        .OrderByDescending(x => x.Timestamp)
                        .Select(log => new AuditLogResponseModel
                        {
                            Id = log.Id,
                            EntityName = log.EntityName,
                            EntityId = log.EntityId,
                            ActionType = log.ActionType,
                            OriginalValue = log.OriginalValue,
                            NewValue = log.NewValue,
                            ChangedBy = log.ChangedBy,
                            Timestamp = log.Timestamp
                        }).ToList();

                    result.Value = logs;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = null;
                    result.IsSuccess = false;
                    result.ErrorMessageKey = "ErrorRetrievingAuditLogsByEntity";
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }
    }
}
