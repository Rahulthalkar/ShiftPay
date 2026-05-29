using System;

namespace ShiftPay.Domain.Model
{
    public class AuditLogRequestModel
    {
        public string EntityName { get; set; } = string.Empty;
        public string? EntityId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string? OriginalValue { get; set; }
        public string? NewValue { get; set; }
        public string ChangedBy { get; set; } = "System";
    }

    public class AuditLogResponseModel
    {
        public int Id { get; set; }
        public string EntityName { get; set; } = string.Empty;
        public string? EntityId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string? OriginalValue { get; set; }
        public string? NewValue { get; set; }
        public string ChangedBy { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
