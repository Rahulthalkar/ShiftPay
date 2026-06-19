export enum ShiftType {
  Day = 0,
  FirstHalfDay = 1,
  SecondHalfDay = 2,
  HalfNight = 3,
  FullNight = 4,
  DoubleNight = 5
}

export enum UserRole {
  Admin = 1,
  Manager = 2,
  Worker = 3
}
export interface APIResult<T> {
  value: T;
  isSuccess: boolean;
  errorMessageKey: string;
  exceptionInfo: string;
}

export interface AdminDashboardStatsModel {
  totalWorkers: number;
  totalWorkersChangePercent: number;
  monthlyPayroll: number;
  monthlyPayrollChangePercent: number;
  activeUsers: number;
  pendingApprovalsCount: number;
  approvedAttendancesCount: number;
  totalAdvanceCount: number;
  totalAdvanceAmount: number;
  totalApprovalsCount: number;
}

export interface ResetRequestModel {
  email: string;
  baseUrl: string;
}

export interface ResetPasswordModel {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}
