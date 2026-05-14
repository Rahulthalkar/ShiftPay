using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ShiftPay.Domain.Tables
{
    public class tblAdvancePayment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AdvancePaymentId { get; set; }

        public int UserId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string? Reason { get; set; }

        public int CreatedBy { get; set; }

        // Navigation
        public tblUser? User { get; set; }
    }
}
