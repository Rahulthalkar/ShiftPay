import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdvanceService } from '../../shared/service/advance.Service';
import { UserService } from '../../shared/service/users.Service';

interface AdvanceRecord {
  date: string;
  amount: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  userId?: number;
}

interface Worker {
  id: string;
  name: string;
}

@Component({
  selector: 'app-advanced-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './advanced-list.html',
  styleUrl: './advanced-list.css',
})
export class AdvancedList implements OnInit {
  workers: Worker[] = [];
  allAdvances: AdvanceRecord[] = [];
  advances: AdvanceRecord[] = [];

  selectedWorkerId: string = 'all';
  workerName: string = 'All Workers';
  workerId: string = 'ALL';

  totalAdvance: number = 0;
  approvedCount: number = 0;

  constructor(
    private advanceService: AdvanceService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getWorkers();
    this.getAllAdvances();
  }

  getWorkers() {
    this.userService.getAllUser().subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          const mappedWorkers = res.value.map((w: any) => ({
            id: String(w.id),
            name: w.fullName
          }));
          this.workers = [{ id: 'all', name: 'All Workers' }, ...mappedWorkers];
          this.selectedWorkerId = 'all';
          this.updateWorkerDetails();
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load workers:', err);
      }
    });
  }

  getAllAdvances() {
    this.advanceService.getAllAdvances().subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          this.allAdvances = res.value.map((item: any) => ({
            date: item.date,
            amount: item.amount,
            reason: item.reason || 'Salary Advance',
            status: 'Approved',
            userId: item.userId
          }));
          this.updateWorkerDetails();
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load advances:', err);
      }
    });
  }

  onWorkerChange() {
    this.updateWorkerDetails();
  }

  updateWorkerDetails() {
    if (this.selectedWorkerId === 'all') {
      this.workerName = 'All Workers';
      this.workerId = 'ALL';
      this.advances = this.allAdvances;
    } else {
      const selectedWorker = this.workers.find(w => w.id === this.selectedWorkerId);
      if (selectedWorker) {
        this.workerName = selectedWorker.name;
        this.workerId = selectedWorker.id;
        this.advances = this.allAdvances.filter(a => String(a.userId) === this.selectedWorkerId);
      }
    }
    this.refreshStats();
  }

  refreshStats() {
    this.totalAdvance = this.advances
      .filter(a => a.status === 'Approved')
      .reduce((sum, current) => sum + current.amount, 0);

    this.approvedCount = this.advances.filter(a => a.status === 'Approved').length;
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Approved': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
      case 'Pending': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
      case 'Rejected': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20';
    }
  }
}
