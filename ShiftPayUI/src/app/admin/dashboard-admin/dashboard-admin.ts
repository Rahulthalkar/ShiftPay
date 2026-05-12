import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Stat {
  label: string;
  value: string;
  trend?: string;
  icon: string;
  color: string;
}

interface Activity {
  user: { name: string; role: string; avatar: string; initial: string };
  action: string;
  entity: string;
  timestamp: string;
  status: 'SUCCESS' | 'PROCESSING' | 'FLAGGED';
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin {
  stats: Stat[] = [
    { label: 'TOTAL WORKERS', value: '1,284', trend: '+4% vs LW', icon: 'users', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'MONTHLY PAYROLL (INR)', value: '4.2m INR', trend: '+4% vs LW', icon: 'credit-card', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'ACTIVE USERS', value: '42', icon: 'shield-check', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'PENDING APPROVALS', value: '18', icon: 'clipboard-list', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'APPROVALS', value: '18', icon: 'clipboard-list', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Total Advance', value: '18', icon: 'clipboard-list', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'APPROVALS', value: '18', icon: 'clipboard-list', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  ];

  activities: Activity[] = [
    {
      user: { name: 'Sanya Malhotra', role: 'HR Manager', avatar: '', initial: 'SM' },
      action: 'Modified Shift Rates',
      entity: 'Payroll Constants',
      timestamp: 'Today, 10:42 AM',
      status: 'SUCCESS',
    },
    {
      user: { name: 'Rahul Kapoor', role: 'System Admin', avatar: '', initial: 'RK' },
      action: 'Bulk User Import',
      entity: 'User Management',
      timestamp: 'Today, 09:15 AM',
      status: 'PROCESSING',
    },
    {
      user: { name: 'James David', role: 'Security Lead', avatar: '', initial: 'JD' },
      action: 'Security Policy Update',
      entity: 'Settings',
      timestamp: 'Yesterday, 04:50 PM',
      status: 'SUCCESS',
    },
    {
      user: { name: 'Vikram Patil', role: 'Junior Admin', avatar: '', initial: 'VP' },
      action: 'Login Attempt Failure',
      entity: 'Auth System',
      timestamp: 'Yesterday, 11:20 AM',
      status: 'FLAGGED',
    },
  ];
}
