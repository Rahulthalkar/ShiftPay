import { Routes } from '@angular/router';
import { DashboardAdmin } from './admin/dashboard-admin/dashboard-admin';
import { Userlist } from './admin/userlist/userlist';
import { CreateUser } from './pages/create-user/create-user';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './shared/guard/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },

  // Admin Routes (Role 1)
  {
    path: 'dashboard-admin',
    component: DashboardAdmin,
    canActivate: [authGuard],
    data: { roles: [1] }
  },
  {
    path: 'dashboardadmin',
    component: DashboardAdmin,
    canActivate: [authGuard],
    data: { roles: [1] }
  },
  {
    path: 'userlist',
    component: Userlist,
    canActivate: [authGuard],
    data: { roles: [1] }
  },
  {
    path: 'userlist/create-user',
    component: CreateUser,
    canActivate: [authGuard],
    data: { roles: [1] }
  },
  {
    path: 'userlist/update-user/:id',
    component: CreateUser,
    canActivate: [authGuard],
    data: { roles: [1] }
  },
  // Worker Routes (Role 3)
  {
    path: 'workerdashboard',
    loadComponent: () => import('./workers/worker-dashboard/worker-dashboard').then(m => m.WorkerDashboard),
    canActivate: [authGuard],
    // data: { roles: [3] }
  },
  {
    path: 'attendance',
    loadComponent: () => import('./pages/attendance/attendance').then(m => m.AttendanceComponent),
    canActivate: [authGuard],
    // data: { roles: [3] }
  },
  {
    path: 'work-entry',
    loadComponent: () => import('./pages/work-entry/work-entry').then(m => m.WorkEntryComponent),
    canActivate: [authGuard],
    // data: { roles: [3] }
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/worker-profile/worker-profile').then(m => m.WorkerProfileComponent),
    canActivate: [authGuard],
    // data: { roles: [3] }
  },

  // Manager / Supervisor Routes (Role 2)
  {
    path: 'approvalattendance',
    loadComponent: () => import('./managerOrHR/approval-attendance/approval-attendance').then(m => m.ApprovalAttendance),
    canActivate: [authGuard],
    // data: { roles: [2] }
  },
  {
    path: 'advancedlist/advance-pay',
    loadComponent: () => import('./pages/advance-pay/advance-pay').then(m => m.AdvancePay),
    canActivate: [authGuard],
    // data: { roles: [2] }
  },
  {
    path: 'advancedlist',
    loadComponent: () => import('./pages/advanced-list/advanced-list').then(m => m.AdvancedList),
    canActivate: [authGuard],
    // data: { roles: [2] }
  },

  // Common Protected Routes
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
