using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.Domain.Model
{
    public class AdvancePaymentModel
    {
       
        public int UserId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string? Reason { get; set; }
        public int CreatedBy { get; set; }

    }
    public class AdvancePaymentResponseModel
    {
        public int AdvancePaymentId { get; set; }

        public int UserId { get; set; }
        public string UserName { get; set; }
        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string? Reason { get; set; }
        public int CreatedBy { get; set; }

        // Navigation
        public tblUser? User { get; set; }
    }
}
