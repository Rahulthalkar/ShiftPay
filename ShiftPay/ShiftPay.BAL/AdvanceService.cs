using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.BAL
{
    public class AdvanceService
    {
        private readonly IConfiguration _configuration;
        private readonly IAdvanceRepository _advanceRepository;

        public AdvanceService(IConfiguration configuration, IAdvanceRepository advanceRepository)
        {
            _configuration = configuration;
            _advanceRepository = advanceRepository;
        }

        public APIResult<bool> CreateAdvance(AdvancePaymentModel advanceModel)
        {
            var result = new APIResult<bool>();
            try
            {
                result = _advanceRepository.CreateAdvance(advanceModel);
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = false;
                result.ErrorMessageKey = "An error occurred while creating the advance payment.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<AdvancePaymentResponseModel> GetAdvanceById(int userId)
        {
            var result = new APIResult<AdvancePaymentResponseModel>();
            try
            {
                result = _advanceRepository.GetAdvanceById(userId);
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = null;
                result.ErrorMessageKey = "An error occurred while retrieving the advance payment.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<List<AdvancePaymentResponseModel>> GetAllAdvances()
        {
            var result = new APIResult<List<AdvancePaymentResponseModel>>();
            try
            {
                result = _advanceRepository.GetAllAdvances();
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = null;
                result.ErrorMessageKey = "An error occurred while retrieving the advance payments.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }

        public APIResult<bool> DeleteAdvance(int id)
        {
            var result = new APIResult<bool>();
            try
            {
                result = _advanceRepository.DeleteAdvance(id);
                return result;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Value = false;
                result.ErrorMessageKey = "An error occurred while deleting the advance payment.";
                result.ExceptionInfo = ex.Message;
                return result;
            }
        }
    }
}
