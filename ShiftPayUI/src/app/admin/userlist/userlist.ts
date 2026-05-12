import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Worker {
  name: string;
  role: string;
  id: string;
  dailyRate: string;
  totalShifts: number;
  lastEntry: string;
  avatarColor: string;
  initials: string;
}

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userlist.html',
  styleUrl: './userlist.css',
})
export class Userlist {
  // Database of workers
  allWorkers: Worker[] = [
    { name: 'Rajesh Kumar', role: 'Skilled', id: '#WL-2024-001', dailyRate: '950.00', totalShifts: 24, lastEntry: 'Oct 24, 2023', avatarColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', initials: 'RK' },
    { name: 'Anita Mishra', role: 'Semi-Skilled', id: '#WL-2024-042', dailyRate: '1,200.00', totalShifts: 18, lastEntry: 'Oct 25, 2023', avatarColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', initials: 'AM' },
    { name: 'Sunil Prasad', role: 'Unskilled', id: '#WL-2024-118', dailyRate: '650.00', totalShifts: 30, lastEntry: 'Oct 26, 2023', avatarColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', initials: 'SP' },
    { name: 'Vikram Yadav', role: 'Skilled', id: '#WL-2024-089', dailyRate: '1,100.00', totalShifts: 12, lastEntry: 'Oct 26, 2023', avatarColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', initials: 'VY' },
    { name: 'Suresh Raina', role: 'Skilled', id: '#WL-2024-005', dailyRate: '980.00', totalShifts: 20, lastEntry: 'Oct 27, 2023', avatarColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', initials: 'SR' },
    { name: 'Priya Sharma', role: 'Semi-Skilled', id: '#WL-2024-012', dailyRate: '1,100.00', totalShifts: 15, lastEntry: 'Oct 28, 2023', avatarColor: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', initials: 'PS' },
    { name: 'Mohit Singh', role: 'Unskilled', id: '#WL-2024-025', dailyRate: '600.00', totalShifts: 28, lastEntry: 'Oct 29, 2023', avatarColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', initials: 'MS' },
  ];

  selectedRole = 'All Roles';
  roles = ['All Roles', 'Skilled', 'Semi-Skilled', 'Unskilled'];

  // Pagination State
  currentPage = 1;
  pageSize = 4;

  router = inject(Router);

  get filteredWorkers(): Worker[] {
    if (this.selectedRole === 'All Roles') {
      return this.allWorkers;
    }
    return this.allWorkers.filter(w => w.role === this.selectedRole);
  }

  get pagedWorkers(): Worker[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredWorkers.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredWorkers.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setRole(role: string) {
    this.selectedRole = role;
    this.currentPage = 1; // Reset to page 1 on filter
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.filteredWorkers.length ? this.filteredWorkers.length : end;
  }

  createUser() {
    this.router.navigate(['/create-user']);
  }
}
