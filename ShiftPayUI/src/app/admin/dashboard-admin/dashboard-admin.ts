import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { admindashboardService } from '../../shared/service/admindashboard.service';
import { Activity, AttendanceDetails, AuditLogResponse } from '../../shared/interface/AuditLogResponse';

interface Stat {
  label: string;
  value: string;
  trend?: string;
  icon: string;
  color: string;
}


@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements OnInit {
  stats: Stat[] = [
    { label: 'TOTAL WORKERS', value: '1,284', trend: '+4% vs LW', icon: 'users', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'MONTHLY PAYROLL (INR)', value: '4.2m INR', trend: '+4% vs LW', icon: 'credit-card', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'ACTIVE USERS', value: '42', icon: 'shield-check', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'PENDING APPROVALS', value: '18', icon: 'clipboard-list', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'APPROVALS', value: '18', icon: 'clipboard-list', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Total Advance', value: '18', icon: 'clipboard-list', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'APPROVALS', value: '18', icon: 'clipboard-list', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  ];

  activities: any[] = [];
  currentPage = 1;
  pageSize = 5;
  constructor(private adminDashboardService: admindashboardService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.getAllAuditLogs1();
    this.getDashboardStats();
  }

  getDashboardStats() {
    this.adminDashboardService.getDashboardStats().subscribe((response: any) => {
      if (response.isSuccess && response.value) {
        const data = response.value;
        this.stats = [
          {
            label: 'TOTAL WORKERS',
            value: data.totalWorkers.toLocaleString(),
            trend: `${data.totalWorkersChangePercent >= 0 ? '+' : ''}${data.totalWorkersChangePercent}% vs LW`,
            icon: 'users',
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          },
          {
            label: 'MONTHLY PAYROLL (INR)',
            value: data.monthlyPayroll >= 1000000
              ? `${(data.monthlyPayroll / 1000000).toFixed(1)}m INR`
              : `${data.monthlyPayroll.toLocaleString()} INR`,
            trend: `${data.monthlyPayrollChangePercent >= 0 ? '+' : ''}${data.monthlyPayrollChangePercent}% vs LW`,
            icon: 'credit-card',
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          },
          {
            label: 'ACTIVE USERS',
            value: data.activeUsers.toString(),
            icon: 'shield-check',
            color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
          },
          {
            label: 'PENDING APPROVALS',
            value: data.pendingApprovalsCount.toString(),
            icon: 'clipboard-list',
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
          },
          {
            label: 'APPROVALS',
            value: data.approvedAttendancesCount.toString(),
            icon: 'clipboard-list',
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
          },
          {
            label: 'Total Advance',
            value: data.totalAdvanceCount.toString(),
            icon: 'clipboard-list',
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
          }

        ];
        this.cdr.detectChanges();
      }
    });
  }
  // getAllAuditLogs() {

  //   this.adminDashboardService.getAllAuditLogs()
  //     .subscribe((response: any) => {

  //       this.activities = response.value.map((item: AuditLogResponse) => {

  //         let parsedValue: AttendanceDetails = {} as AttendanceDetails;

  //         try {

  //           parsedValue = item.newValue
  //             ? JSON.parse(item.newValue)
  //             : {} as AttendanceDetails;

  //         } catch (error) {

  //           console.warn('Invalid JSON:', item.newValue);

  //           parsedValue = {
  //             UserId: 0,
  //             Date: '',
  //             StartTime: '',
  //             EndTime: '',
  //             ShiftType: 0,
  //             Salary: 0,
  //             Status: false,
  //             ApporveById: null,
  //             Latitude: null,
  //             Longitude: null,
  //             ClockInTime: null,
  //             ClockOutTime: null
  //           };
  //         }

  //         return {

  //           id: item.id,

  //           user: {
  //             name: `User ${item.changedBy}`,
  //             role: 'Admin',
  //             initial: `U${item.changedBy}`.charAt(0)
  //           },

  //           action: item.actionType,

  //           entity: item.entityName,

  //           timestamp: item.timestamp,

  //           status:
  //             item.actionType === 'Create'
  //               ? 'SUCCESS'
  //               : item.actionType === 'Update'
  //                 ? 'PROCESSING'
  //                 : 'FLAGGED',

  //           details: parsedValue

  //         } as Activity;
  //       });
  //       this.cdr.detectChanges();
  //       console.log(this.activities);
  //     });
  // }
  getAllAuditLogs1() {
    this.adminDashboardService.getAllAuditLogs().subscribe((response: any) => {
      this.activities = response.value;
      console.log(response.value);
      this.cdr.detectChanges();

    });
  }

  get paginatedActivities(): any[] {
    return this.activities ? this.activities.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) : [];
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
    }
  }

  nextPage() {
    if (this.activities && this.currentPage * this.pageSize < this.activities.length) {
      this.currentPage++;
      this.cdr.detectChanges();
    }
  }

  getStartEntry(): number {
    if (!this.activities || this.activities.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndEntry(): number {
    if (!this.activities) return 0;
    return Math.min(this.currentPage * this.pageSize, this.activities.length);
  }

  isNextDisabled(): boolean {
    return !this.activities || this.currentPage * this.pageSize >= this.activities.length;
  }

  getTotalActivitiesCount(): number {
    return this.activities ? this.activities.length : 0;
  }

}
