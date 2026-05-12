import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface AttendanceRecord {
  id: number;
  workerName: string;
  workerId: string;
  date: string;
  shiftType: string;
  inTime: string;
  outTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  selected?: boolean;
}

@Component({
  selector: 'app-approval-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-attendance.html',
  styleUrl: './approval-attendance.css'
})
export class ApprovalAttendance implements OnInit {
  records: AttendanceRecord[] = [
    { id: 1, workerName: 'Rahul Sharma', workerId: '#WL-2024-001', date: '2024-04-28', shiftType: 'Full Day', inTime: '09:00 AM', outTime: '06:00 PM', status: 'PENDING' },
    { id: 2, workerName: 'Anita Desai', workerId: '#WL-2024-042', date: '2024-04-28', shiftType: 'Half Day', inTime: '09:00 AM', outTime: '01:30 PM', status: 'PENDING' },
    { id: 3, workerName: 'James Wilson', workerId: '#WL-2024-118', date: '2024-04-28', shiftType: 'Full Night', inTime: '09:00 PM', outTime: '06:00 AM', status: 'PENDING' },
    { id: 4, workerName: 'David Miller', workerId: '#WL-2024-089', date: '2024-04-28', shiftType: 'Full Day', inTime: '09:15 AM', outTime: '06:15 PM', status: 'PENDING' },
    { id: 5, workerName: 'Suresh Kumar', workerId: '#WL-2024-055', date: '2024-04-28', shiftType: 'Second Half', inTime: '01:30 PM', outTime: '06:30 PM', status: 'PENDING' },
  ];

  stats = {
    pending: 5,
    approvedToday: 12,
    rejectedToday: 1,
    totalToday: 18
  };

  selectAll = false;
  currentTab: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';

  ngOnInit() { }

  get filteredRecords() {
    return this.records.filter(r => r.status === this.currentTab);
  }

  toggleSelectAll() {
    this.records.forEach(r => r.selected = this.selectAll);
  }

  approve(record: AttendanceRecord) {
    record.status = 'APPROVED';
    this.refreshStats();
  }

  reject(record: AttendanceRecord) {
    record.status = 'REJECTED';
    this.refreshStats();
  }

  approveBatch() {
    this.records.filter(r => r.selected).forEach(r => r.status = 'APPROVED');
    this.refreshStats();
  }

  refreshStats() {
    this.stats.pending = this.records.filter(r => r.status === 'PENDING').length;
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
