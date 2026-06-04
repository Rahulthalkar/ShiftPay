using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.BAL
{
    public class AuditLogService
    {
        private readonly IConfiguration _configuration;
        private readonly IAuditLogRepository _auditLogRepository;

        public AuditLogService(IConfiguration configuration,IAuditLogRepository auditLogRepository)
        {
            _configuration= configuration;
            _auditLogRepository= auditLogRepository;
        }

        public APIResult<List<AuditLogResponseModel>> GetAllAuditLogs()
        {
            var result = new APIResult<List<AuditLogResponseModel>>();
            try
            {
                result = _auditLogRepository.GetAllAuditLogs();
                return result;

            }
            catch (Exception ex)
            {
                result.ErrorMessageKey = ex.Message;
                result.IsSuccess = false;
                result.Value = null;
                result.ExceptionInfo = "failed";
                return result;
            }
        }
    }
}
