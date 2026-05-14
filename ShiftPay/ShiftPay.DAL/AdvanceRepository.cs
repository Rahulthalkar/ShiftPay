using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL
{
    public class AdvanceRepository : IAdvanceRepository
    {
        private readonly string connectionString;
        
        public AdvanceRepository(IConfiguration configuration)
        { 
            connectionString=Convert.ToString(configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
        }
        public APIResult<bool> CreateAdvance(AdvancePaymentModel advanceModel)
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<bool> result = new APIResult<bool>();
                try
                {
                    var advanceEntity = new tblAdvancePayment
                    {
                        AdvancePaymentId=0,
                        UserId = advanceModel.UserId,
                        Amount = advanceModel.Amount,
                        Date = advanceModel.Date,
                        Reason = advanceModel.Reason,
                        CreatedBy = advanceModel.CreatedBy // Assuming the user creating the advance is the same as the one receiving it
                    };
                    dbContext.AdvancePayments.Add(advanceEntity);
                    dbContext.SaveChanges();

                    result.Value = true;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                    return new APIResult<bool> { Value = false, IsSuccess = false, ErrorMessageKey = "ErrorCreatingAdvance", ExceptionInfo = ex.ToString() };
                }
            }
        }

        public APIResult<bool> DeleteAdvance(int id)
        {
            throw new NotImplementedException();
        }

        public APIResult<AdvancePaymentResponseModel> GetAdvanceById(int userId)
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<AdvancePaymentResponseModel> result = new APIResult<AdvancePaymentResponseModel>();
                try
                {
                    var advanceEntity = (from adv in dbContext.AdvancePayments join user in dbContext.Users on adv.UserId equals user.Id
                                         where adv.UserId == userId
                                         orderby adv.Date descending
                                         select new AdvancePaymentResponseModel
                                         {
                                                AdvancePaymentId = adv.AdvancePaymentId,
                                                UserId = adv.UserId,
                                                UserName = user.Username, // Assuming tblUser has a FullName property
                                                Amount = adv.Amount,
                                                Date = adv.Date,
                                                Reason = adv.Reason,
                                                CreatedBy = adv.CreatedBy                                                
                                         }).FirstOrDefault();
                    if (advanceEntity == null)
                    {
                        result.Value = null;
                        result.IsSuccess = false;
                        result.ExceptionInfo = "Advancenotfound";
                        return result;
                    }
                   
                    result.Value = advanceEntity;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                   result.Value = null;
                   result.IsSuccess = false;
                   result.ExceptionInfo = ex.ToString();
                   return result;
                }
            }
        }

        public APIResult<List<AdvancePaymentResponseModel>> GetAllAdvances()
        {
            using(var dbContext = new EmpDbEntities(connectionString))
            {
                APIResult<List<AdvancePaymentResponseModel>> result = new APIResult<List<AdvancePaymentResponseModel>>();
                try
                {
                    var advanceEntities = (from adv in dbContext.AdvancePayments join user in dbContext.Users on adv.UserId equals user.Id
                                         orderby adv.Date descending
                                         select new AdvancePaymentResponseModel
                                         {
                                             AdvancePaymentId = adv.AdvancePaymentId,
                                             UserId = adv.UserId,
                                             UserName = user.Username, // Assuming tblUser has a FullName property
                                             Amount = adv.Amount,
                                             Date = adv.Date,
                                             Reason = adv.Reason,
                                             CreatedBy = adv.CreatedBy
                                         }).ToList();
                    if (advanceEntities == null || advanceEntities.Count == 0)
                    {
                        result.Value = null;
                        result.IsSuccess = false;
                        result.ExceptionInfo = "Noadvancesfound";
                        return result;
                    }
                    result.Value = advanceEntities;
                    result.IsSuccess = true;
                    result.ExceptionInfo = "success";
                    return result;
                }
                catch (Exception ex)
                {
                    result.Value = null;
                    result.IsSuccess = false;
                    result.ExceptionInfo = ex.ToString();
                    return result;
                }
            }
        }

        public APIResult<bool> UpdateAdvance(AdvancePaymentModel advanceModel)
        {
            throw new NotImplementedException();
        }
    }
}
