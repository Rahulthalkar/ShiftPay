import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/service/dataservice';

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
  attendanceRecord: any[] = [];
  paginatedRecords: any[] = [];

  totalShifts = 0;
  totalEarnings = '₹0.00';
  selectedMonth = 'May 2026';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {
    this.selectedMonth = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }

  ngOnInit() {
    this.getAllAttendance();
  }

  getAllAttendance() {
    this.dataService.getAllAttendance().subscribe((response: any) => {
      if (response && response.isSuccess && response.value) {
        const getShiftClass = (type: string): string => {
          switch (type) {
            case 'Day':
              return 'bg-blue-50/80 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            case 'FirstHalfDay':
            case 'HalfDay':
              return 'bg-amber-50/80 text-amber-600 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
            case 'SecondHalfDay':
              return 'bg-orange-50/80 text-orange-600 border border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
            case 'HalfNight':
              return 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
            case 'FullNight':
              return 'bg-indigo-50/80 text-indigo-600 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
            case 'DoubleNight':
              return 'bg-fuchsia-50/80 text-fuchsia-600 border border-fuchsia-100 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20';
            default:
              return 'bg-slate-50 text-slate-500 border border-slate-100 dark:bg-slate-500/10 dark:text-slate-400';
          }
        };

        const getDuration = (start: string, end: string): string => {
          if (!start || !end) return '-';
          const [sH, sM] = start.split(':').map(Number);
          const [eH, eM] = end.split(':').map(Number);
          let diffHours = eH - sH;
          let diffMins = eM - sM;
          if (diffHours < 0) {
            diffHours += 24;
          }
          if (diffMins < 0) {
            diffMins += 60;
            diffHours -= 1;
          }
          return `${diffHours} hrs ${diffMins > 0 ? diffMins + ' mins' : ''}`.trim();
        };

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        this.attendanceRecord = response.value.map((item: any) => {
          const itemDate = new Date(item.date);
          const dayName = daysOfWeek[itemDate.getDay()];

          return {
            ...item,
            day: dayName,
            shiftClass: getShiftClass(item.shiftType),
            timeRange: `${item.startTime || ''} - ${item.endTime || ''}`,
            duration: getDuration(item.startTime, item.endTime),
            salary: `₹${(item.salary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          };
        });

        // Calculate dynamic page summaries
        this.totalShifts = this.attendanceRecord.length;
        const total = response.value.reduce((acc: number, curr: any) => acc + (curr.salary || 0), 0);
        this.totalEarnings = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        this.currentPage = 1;
        this.updatePagination();
        this.cdr.detectChanges();
      } else {
        this.attendanceRecord = [];
        this.paginatedRecords = [];
        this.totalShifts = 0;
        this.totalPages = 1;
        this.currentPage = 1;
        this.totalEarnings = '₹0.00';
        this.cdr.detectChanges();
      }
    });
  }

  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.attendanceRecord.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRecords = this.attendanceRecord.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  get startRecord(): number {
    return this.attendanceRecord.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.attendanceRecord.length);
  }

  getPageNumbers(): (number | '...')[] {
    const pages: (number | '...')[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }

    return pages;
  }

  onPageSizeChange(size: number | string) {
    this.pageSize = Number(size);
    this.currentPage = 1;
    this.updatePagination();
  }
}
