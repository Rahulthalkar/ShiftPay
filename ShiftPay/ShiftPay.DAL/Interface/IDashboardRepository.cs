using ShiftPay.Domain.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.DAL.Interface
{
    public interface IDashboardRepository
    {
        APIResult<AdminDashboardStatsModel> GetAdminDashboardStats();
    }
}
