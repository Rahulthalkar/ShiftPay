import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/service/users.Service';
import { ToastrService } from '../../shared/service/toastr.service';
import { DataService } from '../../shared/service/dataservice';
import { AuthService } from '../../shared/service/auth.service';
import { CalendarComponent } from '../../shared/components/calendar/calendar';

interface Shift {
  date: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  salary: number;
}

interface Advance {
  date: string;
  reason: string;
  amount: number;
}

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './worker-dashboard.html',
  styleUrl: './worker-dashboard.css',
})
export class WorkerDashboard implements OnInit {
  workerName: string = 'David';
  dailyRate: number = 550;
  currentDate: string = '';

  startDate: string = '2026-05-01';
  endDate: string = '2026-05-29';
  activeFilter: 'month' | 'year' | 'custom' = 'month';

  stats = {
    halfDays: 0,
    secondHalf: 0,
    fullNight: 0,
    halfNight: 0,
    doubleNight: 0,
    totalSalary: 0,
    balance: 0,
    totalShifts: 0,
    salaryEarned: 0,
    advancesTaken: 0,
    totalDays: 0,
    day: 0
  };

  recentShifts: Shift[] = [];
  recentAdvances: Advance[] = [];

  rawWorkEntries: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private dataService: DataService
  ) {
    this.currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  ngOnInit() {
    this.getWorkerDashboard();
  }

  getWorkerDashboard() {
    const loggedInUser = this.authService.currentUserValue;
    const userId = loggedInUser?.id || 2;

    // Fetch dashboard statistics
    this.dataService.getWorkerDashboard(2, this.startDate, this.endDate).subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          const data = res.value;
          this.stats = {
            totalDays: data.totalDays || 0,
            halfDays: (data.shiftCounts?.halfDay || 0) + (data.shiftCounts?.firstHalfDay || 0),
            secondHalf: data.shiftCounts?.secondHalfDay || 0,
            fullNight: data.shiftCounts?.fullNight || 0,
            halfNight: data.shiftCounts?.halfNight || 0,
            doubleNight: data.shiftCounts?.doubleNight || 0,
            totalSalary: data.totalSalary || 0,
            balance: data.balance || 0,
            totalShifts: data.totalShifts || 0,
            salaryEarned: data.totalSalary || 0,
            advancesTaken: data.totalAdvance || 0,
            day: data.shiftCounts.day

          };

          // Map shifts
          this.recentShifts = (data.workEntries || []).map((entry: any) => ({
            date: entry.date,
            shiftType: entry.shiftType,
            startTime: entry.startTime,
            endTime: entry.endTime,
            salary: entry.salary
          }));

          // Map advances
          this.recentAdvances = (data.advancePayments || []).map((adv: any) => ({
            date: adv.date,
            reason: adv.remarks || 'Salary Advance',
            amount: adv.amount
          }));

          // Set raw work entries to bind to the reusable calendar component
          this.rawWorkEntries = data.workEntries || [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.toastr.error('Failed to load dashboard statistics.');
      }
    });
  }

  selectThisMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDayDate = new Date(year, month + 1, 0).getDate();
    const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDayDate).padStart(2, '0')}`;

    this.startDate = firstDay;
    this.endDate = lastDay;
    this.activeFilter = 'month';
    this.getWorkerDashboard();
  }

  selectYearToDate() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const fiscalStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
    const firstDay = `${fiscalStartYear}-04-01`;
    const lastDay = `${fiscalStartYear + 1}-03-31`;

    this.startDate = firstDay;
    this.endDate = lastDay;
    this.activeFilter = 'year';
    this.getWorkerDashboard();
  }

  onDateRangeChanged(event: { startDate: string, endDate: string }) {
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.activeFilter = 'custom';
    this.getWorkerDashboard();
  }

  onFilter() {
    this.activeFilter = 'custom';
    this.getWorkerDashboard();
  }
}
