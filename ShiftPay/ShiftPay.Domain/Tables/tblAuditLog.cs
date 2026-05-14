using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShiftPay.Domain.Tables
{
    public class tblAuditLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string EntityName { get; set; } = string.Empty;

        public string? EntityId { get; set; }

        [Required]
        public string ActionType { get; set; } = string.Empty; // Create, Update, Delete

        public string? OriginalValue { get; set; }

        public string? NewValue { get; set; }

        [Required]
        public string ChangedBy { get; set; } = "System";

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
