import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../shared/service/users.Service';

interface Worker {
  id: number;
  username: string;
  roleId: number;
  roleName: string;
  fullName: string;
  dailyRate: number;
  profileImageUrl: string;
  phoneNumber: string;
  isActive: boolean;
  managerId: number;
  // UI Specific Properties
  employeeCode: string;
  initials: string;
  avatarColor: string;
  totalShifts: number;
  lastEntry: string;
}

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userlist.html',
  styleUrl: './userlist.css',
})
export class Userlist implements OnInit {
  // Database of workers
  allWorkers: Worker[] = [];

  // Pagination State
  currentPage = 1;
  pageSize = 4;

  router = inject(Router);
  userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          const colors = [
            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
            'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
            'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
            'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
          ];

          this.allWorkers = res.value.map((worker: any, index: number) => {
            // Get initials from full name
            let initials = '??';
            if (worker.fullName) {
              const names = worker.fullName.trim().split(/\s+/);
              if (names.length === 1) {
                initials = names[0].substring(0, 2).toUpperCase();
              } else if (names.length > 1) {
                initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
              }
            }

            // Assign a cohesive, premium styling class based on index
            const avatarColor = colors[index % colors.length];

            // Generate an employee code
            const employeeCode = `#WL-2024-${String(worker.id).padStart(3, '0')}`;

            // Fallbacks for missing statistics
            const totalShifts = worker.totalShifts || (12 + (worker.id % 15));
            const lastEntry = worker.lastEntry || 'Oct 28, 2023';

            return {
              ...worker,
              initials,
              avatarColor,
              totalShifts,
              lastEntry,
              employeeCode
            };
          });

        } else {
          this.allWorkers = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.cdr.detectChanges();
      }
    });
  }


  get avgDailyRate(): number {
    if (this.allWorkers.length === 0) return 0;
    const sum = this.allWorkers.reduce((acc, curr) => acc + curr.dailyRate, 0);
    return Math.round(sum / this.allWorkers.length);
  }

  get pagedWorkers(): Worker[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.allWorkers.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.allWorkers.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get startIndex(): number {
    return this.allWorkers.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.allWorkers.length ? this.allWorkers.length : end;
  }

  createUser() {
    this.router.navigate(['userlist/create-user']);
  }

  getUserById(workerId: number) {
    this.router.navigate(['userlist/update-user', workerId]);
  }

  deleteWorker(workerId: number) {
    if (confirm('Are you sure you want to delete this worker?')) {
      this.userService.deleteUser(workerId).subscribe({
        next: (res: any) => {
          if (res && res.isSuccess) {
            this.loadUsers();
          } else {
            alert(res?.errorMessageKey || 'Failed to delete worker.');
          }
        },
        error: (err) => {
          console.error('Delete worker error:', err);
          alert('Failed to delete worker. Please check your permissions.');
        }
      });
    }
  }
}
