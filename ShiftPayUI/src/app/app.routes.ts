import { Routes } from '@angular/router';
import { DashboardAdmin } from './admin/dashboard-admin/dashboard-admin';
import { Userlist } from './admin/userlist/userlist';
import { CreateUser } from './pages/create-user/create-user';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'dashboard-admin', component: DashboardAdmin },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
  },
  {
    path: 'dashboardadmin',
    component: DashboardAdmin
  },
  {
    path: 'userlist',
    component: Userlist
  },
  {
    path: 'create-user',
    component: CreateUser
  },
  {
    path: 'attendance',
    loadComponent: () => import('./pages/attendance/attendance').then(m => m.AttendanceComponent)
  },
  {
    path: 'work-entry',
    loadComponent: () => import('./pages/work-entry/work-entry').then(m => m.WorkEntryComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/worker-profile/worker-profile').then(m => m.WorkerProfileComponent)
  },
  {
    path: 'advance-pay',
    loadComponent: () => import('./pages/advance-pay/advance-pay').then(m => m.AdvancePay)
  },
  {
    path: 'advancedlist',
    loadComponent: () => import('./pages/advanced-list/advanced-list').then(m => m.AdvancedList)
  },
  {
    path: 'workerdashboard',
    loadComponent: () => import('./workers/worker-dashboard/worker-dashboard').then(m => m.WorkerDashboard)
  },
  {
    path: 'approvalattendance',
    loadComponent: () => import('./managerOrHR/approval-attendance/approval-attendance').then(m => m.ApprovalAttendance)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent)
  }
];
