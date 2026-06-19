using System;
using System.Collections.Generic;
using System.Text;

namespace ShiftPay.Domain.Tables
{
  
    public class tblEmailConfigurations
    {
        public int Id { get; set; }
        public string? DisplayName { get; set; }
        public string? From { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }
        public bool UseStartTls { get; set; }
    }
}
