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
  workerlist: any[] = [];
  selectedWorkerId: number = 0;
  currentDate: string = '';
  isWorker: boolean = false;
  loggedInUserId: number = 0;

  startDate: string = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  })();
  endDate: string = (() => {
    const d = new Date();
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(last).padStart(2, '0')}`;
  })();
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
    const loggedInUser = this.authService.currentUserValue;
    this.isWorker = loggedInUser?.roleId === 3;
    this.loggedInUserId = loggedInUser?.id || 0;

    if (this.isWorker) {
      this.selectedWorkerId = this.loggedInUserId;
      // Fetch details of the current worker to populate the header
      this.userService.getUserById(this.loggedInUserId).subscribe({
        next: (res) => {
          if (res && res.isSuccess && res.value) {
            this.workerlist = [res.value];
          } else {
            this.workerlist = [{
              id: this.loggedInUserId,
              fullName: loggedInUser.firstName || loggedInUser.userName || 'Worker',
              dailyRate: 0
            }];
          }
          this.getWorkerDashboard();
        },
        error: (err) => {
          console.error('Failed to fetch worker details:', err);
          this.workerlist = [{
            id: this.loggedInUserId,
            fullName: loggedInUser.firstName || loggedInUser.userName || 'Worker',
            dailyRate: 0
          }];
          this.getWorkerDashboard();
        }
      });
    } else {
      this.loadWorkers();
    }
  }

  loadWorkers() {
    const loggedInUser = this.authService.currentUserValue;
    const roleId = loggedInUser?.roleId;
    const userId = loggedInUser?.id || 0;


    // Manager: load workers supervised by this supervisor/manager
    this.userService.getWorkersBySupervisorId(userId).subscribe({
      next: (res) => {
        this.workerlist = res.value || [];

        // Prepend himself (the manager) to the dropdown options
        this.userService.getUserById(userId).subscribe({
          next: (managerRes) => {
            if (managerRes && managerRes.isSuccess && managerRes.value) {
              this.workerlist.unshift(managerRes.value);
            }
            this.selectedWorkerId = userId;
            this.getWorkerDashboard();
          },
          error: (err) => {
            console.error('Failed to fetch manager details:', err);
            this.selectedWorkerId = userId;
            this.getWorkerDashboard();
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch supervised workers:', err);
      }
    });

  }

  onWorkerChange() {
    this.selectedWorkerId = Number(this.selectedWorkerId);
    this.getWorkerDashboard();
  }

  getWorkerDashboard() {
    const userId = this.isWorker ? this.loggedInUserId : this.selectedWorkerId;
    if (!userId) return;

    // Fetch dashboard statistics
    this.dataService.getWorkerDashboard(userId, this.startDate, this.endDate).subscribe({
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
    const currentYear = new Date().getFullYear();
    this.startDate = `${currentYear}-01-01`;
    this.endDate = `${currentYear}-12-31`;
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
    this.cdr.detectChanges();
  }
}
