import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnChanges {
  @Input() startDate: string = '';
  @Input() workEntries: any[] = [];
  @Output() dateRangeChange = new EventEmitter<{ startDate: string, endDate: string }>();

  calendarDays: any[] = [];

  months = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 }
  ];

  years: number[] = [];
  selectedMonth: number = 0;
  selectedYear: number = 2026;

  constructor() {
    const currentYear = new Date().getFullYear();
    // Generate years from currentYear - 5 to currentYear + 2
    for (let y = currentYear - 5; y <= currentYear + 2; y++) {
      this.years.push(y);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startDate'] && this.startDate) {
      const date = new Date(this.startDate);
      this.selectedMonth = date.getMonth();
      this.selectedYear = date.getFullYear();
    }
    
    if (changes['startDate'] || changes['workEntries']) {
      this.generateCalendar();
    }
  }

  onDropdownChange() {
    const firstDay = `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-01`;
    const lastDayDate = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    const lastDay = `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(lastDayDate).padStart(2, '0')}`;

    this.dateRangeChange.emit({ startDate: firstDay, endDate: lastDay });
  }

  generateCalendar() {
    this.calendarDays = [];
    if (!this.startDate) return;

    const date = new Date(this.startDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Map work entries by date: key -> list of entries
    const entryMap = new Map<string, any[]>();
    if (this.workEntries && this.workEntries.length > 0) {
      this.workEntries.forEach(entry => {
        if (entry.date) {
          const key = entry.date.split('T')[0];
          if (!entryMap.has(key)) {
            entryMap.set(key, []);
          }
          entryMap.get(key)!.push(entry);
        }
      });
    }

    // Add empty slots for the first week
    for (let i = 0; i < firstDayIndex; i++) {
      this.calendarDays.push({ day: null });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const getShiftStyleClass = (type: string): string => {
      switch (type) {
        case 'Day':
          return 'bg-blue-50/80 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400';
        case 'FirstHalfDay':
        case 'HalfDay':
          return 'bg-amber-50/80 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400';
        case 'SecondHalfDay':
          return 'bg-orange-50/80 border-orange-200 text-orange-600 dark:bg-orange-950/20 dark:border-orange-900/40 dark:text-orange-400';
        case 'HalfNight':
          return 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400';
        case 'FullNight':
          return 'bg-indigo-50/80 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400';
        case 'DoubleNight':
          return 'bg-fuchsia-50/80 border-fuchsia-200 text-fuchsia-600 dark:bg-fuchsia-950/20 dark:border-fuchsia-900/40 dark:text-fuchsia-400';
        default:
          return '';
      }
    };

    const getShiftDotColor = (type: string): string => {
      switch (type) {
        case 'Day': return 'bg-blue-400';
        case 'FirstHalfDay':
        case 'HalfDay': return 'bg-amber-400';
        case 'SecondHalfDay': return 'bg-orange-400';
        case 'HalfNight': return 'bg-slate-400';
        case 'FullNight': return 'bg-indigo-400';
        case 'DoubleNight': return 'bg-fuchsia-400';
        default: return 'bg-slate-400';
      }
    };

    // Add days of the month
    for (let i = 1; i <= totalDays; i++) {
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEntries = entryMap.get(dayStr) || [];
      const isToday = dayStr === todayStr;

      let shiftClass = '';
      const dayShifts = dayEntries.map(entry => ({
        shiftType: entry.shiftType,
        dotColor: getShiftDotColor(entry.shiftType)
      }));

      if (dayEntries.length === 1) {
        shiftClass = getShiftStyleClass(dayEntries[0].shiftType);
      } else if (dayEntries.length > 1) {
        shiftClass = 'bg-gradient-to-br from-indigo-50/40 to-emerald-50/40 border-indigo-300 dark:from-indigo-950/20 dark:to-emerald-950/20 dark:border-indigo-800/60 text-slate-800 dark:text-slate-300';
      }

      this.calendarDays.push({
        day: i,
        current: isToday,
        shifts: dayShifts,
        shiftClass
      });
    }
  }
}
