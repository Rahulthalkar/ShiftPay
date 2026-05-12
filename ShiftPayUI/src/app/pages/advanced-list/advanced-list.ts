import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface AdvanceRecord {
  date: string;
  amount: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
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
  workers: Worker[] = [
    { id: '#WL-2024-001', name: 'Rajesh Kumar' },
    { id: '#WL-2024-042', name: 'Anita Mishra' },
    { id: '#WL-2024-118', name: 'Sunil Prasad' },
    { id: '#WL-2024-089', name: 'Vikram Yadav' },
  ];

  selectedWorkerId: string = this.workers[0].id;
  workerName: string = this.workers[0].name;
  workerId: string = this.workers[0].id;

  // Database of advances mapped to worker IDs
  allAdvances: { [key: string]: AdvanceRecord[] } = {
    '#WL-2024-001': [
      { date: '2024-03-15', amount: 5000, reason: 'Medical Emergency', status: 'Approved' },
      { date: '2024-02-10', amount: 2000, reason: 'Festival Advance', status: 'Approved' },
      { date: '2024-04-01', amount: 1500, reason: 'Personal Loan', status: 'Pending' },
      { date: '2024-01-20', amount: 3000, reason: 'Home Repairs', status: 'Approved' },
    ],
    '#WL-2024-042': [
      { date: '2024-03-20', amount: 4500, reason: 'Family Visit', status: 'Approved' },
      { date: '2024-02-05', amount: 1200, reason: 'Utility Bills', status: 'Approved' },
    ],
    '#WL-2024-118': [
      { date: '2024-04-10', amount: 8000, reason: 'Education Fees', status: 'Pending' },
    ],
    '#WL-2024-089': [],
  };

  advances: AdvanceRecord[] = [];
  totalAdvance: number = 0;
  approvedCount: number = 0;

  ngOnInit() {
    this.updateWorkerDetails();
  }

  onWorkerChange() {
    this.updateWorkerDetails();
  }

  updateWorkerDetails() {
    const selectedWorker = this.workers.find(w => w.id === this.selectedWorkerId);
    if (selectedWorker) {
      this.workerName = selectedWorker.name;
      this.workerId = selectedWorker.id;
      this.advances = this.allAdvances[this.selectedWorkerId] || [];
      this.refreshStats();
    }
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
