using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL.Interface
{
    public interface IEmailRepository
    {
        public APIResult<EmailConfigurationModel> GetEmailConfiguration();
    }
}
