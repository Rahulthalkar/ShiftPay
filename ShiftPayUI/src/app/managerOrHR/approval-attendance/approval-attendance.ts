import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../../shared/service/dataservice';
import { AuthService } from '../../shared/service/auth.service';


@Component({
  selector: 'app-approval-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-attendance.html',
  styleUrl: './approval-attendance.css'
})
export class ApprovalAttendance implements OnInit {
  records: any[] = [];

  stats = {
    pending: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalToday: 0
  };

  selectAll = false;
  currentTab: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';

  constructor(private dataService: DataService,
    private Cdt: ChangeDetectorRef,
    private authService: AuthService
  ) {

  }
  ngOnInit() {
    const loggedInUser = this.authService.currentUserValue;
    const userId = loggedInUser?.id || 0;
    this.getAllWorkersBySupervisorId(userId);
  }

  getAllWorkersBySupervisorId(userId: number) {
    this.dataService.getAllWorkersBySupervisorId(userId).subscribe((res: any) => {
      if (res && res.isSuccess && res.value) {
        this.records = res.value;
      } else {
        this.records = Array.isArray(res) ? res : [];
      }
      this.refreshStats();
      this.Cdt.detectChanges();
    });
  }
  executeApproval(attendanceIds: number[], successCallback: () => void) {
    const loggedInUser = this.authService.currentUserValue;
    const managerId = loggedInUser?.id || 0;

    const payload = {
      attendanceIds: attendanceIds,
      managerId: managerId
    };

    this.dataService.approvalAttendanceByManagerBatch(payload).subscribe({
      next: (res: any) => {
        if (res && res.isSuccess) {
          successCallback();
          this.refreshStats();
          this.Cdt.detectChanges();
        } else {
          alert('Approval failed: ' + (res?.errorMessageKey || 'unknown error'));
        }
      },
      error: (err) => {
        console.error('Approval failed:', err);
        alert('An error occurred during approval.');
      }
    });
  }

  approve(record: any) {
    this.executeApproval([record.attendanceId], () => {
      record.status = 'APPROVED';
    });
  }

  reject(record: any) {
    // Keep local rejection for visual state or implement custom backend call
    record.status = 'REJECTED';
    this.refreshStats();
  }

  approveBatch() {
    const selectedRecords = this.records.filter(r => r.selected && r.status === 'PENDING');
    if (selectedRecords.length === 0) return;

    this.executeApproval(selectedRecords.map(r => r.attendanceId), () => {
      selectedRecords.forEach(r => {
        r.status = 'APPROVED';
        r.selected = false;
      });
      this.selectAll = false;
    });
  }

  get filteredRecords() {
    return this.records.filter(r => r.status === this.currentTab);
  }

  toggleSelectAll() {
    this.records.forEach(r => r.selected = this.selectAll);
  }

  refreshStats() {
    this.stats.pending = this.records.filter(r => r.status === 'PENDING').length;
    this.stats.approvedToday = this.records.filter(r => r.status === 'APPROVED').length;
    this.stats.rejectedToday = this.records.filter(r => r.status === 'REJECTED').length;
    this.stats.totalToday = this.records.length;
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'APPROVED': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
      case 'REJECTED': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
      case 'PENDING': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
      default: return '';
    }
  }
}
