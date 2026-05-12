import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface AttendanceRecord {
  date: string;
  day: string;
  shiftType: string;
  shiftClass: string;
  timeRange: string;
  duration: string;
  salary: string;
  status: 'APPROVED' | 'PENDING' | 'FLAGGED';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styles: [`
    :host { display: block; }
  `]
})
export class AttendanceComponent implements OnInit {
  records: AttendanceRecord[] = [
    {
      date: 'Sep 18, 2023',
      day: 'Monday',
      shiftType: 'DAY SHIFT',
      shiftClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      timeRange: '08:00 - 17:00',
      duration: '9.0 hrs',
      salary: '$180.00',
      status: 'APPROVED'
    },
    {
      date: 'Sep 17, 2023',
      day: 'Sunday',
      shiftType: 'HALF NIGHT',
      shiftClass: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
      timeRange: '18:00 - 00:00',
      duration: '6.0 hrs',
      salary: '$150.00',
      status: 'PENDING'
    },
    {
      date: 'Sep 16, 2023',
      day: 'Saturday',
      shiftType: 'FULL NIGHT',
      shiftClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
      timeRange: '22:00 - 06:00',
      duration: '8.0 hrs',
      salary: '$240.00',
      status: 'FLAGGED'
    },
    {
      date: 'Sep 15, 2023',
      day: 'Friday',
      shiftType: 'DOUBLE NIGHT',
      shiftClass: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
      timeRange: '20:00 - 08:00',
      duration: '12.0 hrs',
      salary: '$420.00',
      status: 'APPROVED'
    },
    {
      date: 'Sep 14, 2023',
      day: 'Thursday',
      shiftType: 'DAY SHIFT',
      shiftClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      timeRange: '08:00 - 17:00',
      duration: '9.0 hrs',
      salary: '$180.00',
      status: 'APPROVED'
    }
  ];

  totalShifts = 24;
  totalEarnings = '$4,820.50';
  selectedMonth = 'September 2023';

  ngOnInit() { }
}
