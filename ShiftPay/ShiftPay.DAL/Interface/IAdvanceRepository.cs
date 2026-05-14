using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL.Interface
{
    public interface IAdvanceRepository
    {
        public APIResult<bool> CreateAdvance(AdvancePaymentModel advanceModel);
        public APIResult<AdvancePaymentResponseModel> GetAdvanceById(int userId);
        public APIResult<List<AdvancePaymentResponseModel>> GetAllAdvances();
        public APIResult<bool> UpdateAdvance(AdvancePaymentModel advanceModel);
        public APIResult<bool> DeleteAdvance(int id);
    }
}
