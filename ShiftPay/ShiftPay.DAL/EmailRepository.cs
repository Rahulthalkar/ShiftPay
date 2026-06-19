using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using ShiftPay.Domain.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL
{
    public class EmailRepository : IEmailRepository
    {
        private readonly string connectionString;

        public EmailRepository(IConfiguration configuration)
        {
            connectionString = Convert.ToString(configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
        }
        public APIResult<EmailConfigurationModel> GetEmailConfiguration()
        {
            APIResult<EmailConfigurationModel> response = new APIResult<EmailConfigurationModel>();
            using (var context = new EmpDbEntities(connectionString))
            {
                var emailConfigs = (from conf in context.EmailConfigurations select conf).FirstOrDefault();
                if (emailConfigs != null)
                {
                    EmailConfigurationModel resetPasswordEmailResponseModel = new EmailConfigurationModel()
                    {
                        DisplayName = emailConfigs.DisplayName,
                        From = emailConfigs.From,
                        Password = emailConfigs.Password,
                        Host = emailConfigs.Host,
                        Port = emailConfigs.Port,
                        UseSSL = emailConfigs.UseSSL,
                        UserName = emailConfigs.UserName,
                        UseStartTls = emailConfigs.UseSSL
                    };
                    response.Value = resetPasswordEmailResponseModel;
                    response.IsSuccess = true;
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessageKey = "NoEmailConfigurationFound";
                }
                return response;
            }
        }
    }
}
