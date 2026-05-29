using ShiftPay.Domain.Model;
using System.Collections.Generic;

namespace ShiftPay.DAL.Interface
{
    public interface IAuditLogRepository
    {
        public APIResult<bool> CreateAuditLog(AuditLogRequestModel model);
        public APIResult<List<AuditLogResponseModel>> GetAllAuditLogs();
        public APIResult<List<AuditLogResponseModel>> GetAuditLogsByEntity(string entityName, string? entityId);
    }
}
