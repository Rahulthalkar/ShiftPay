using Microsoft.Extensions.Configuration;
using ShiftPay.DAL.Interface;
using ShiftPay.Domain.Model;
using System;

namespace ShiftPay.BAL
{
    public class DashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;
        private readonly IConfiguration _configuration;

        public DashboardService(IConfiguration configuration, IDashboardRepository dashboardRepository)
        {
            _configuration = configuration;
            _dashboardRepository = dashboardRepository;
        }

        public APIResult<AdminDashboardStatsModel> GetAdminDashboardStats()
        {
            return _dashboardRepository.GetAdminDashboardStats();
        }
    }
}
