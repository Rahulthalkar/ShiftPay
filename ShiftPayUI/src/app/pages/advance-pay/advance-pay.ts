import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface RecentActivity {
  id: number;
  workerName: string;
  department: string;
  amount: number;
  timeLabel: string;
  reason: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-advance-pay',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './advance-pay.html',
  styleUrl: './advance-pay.css',
})
export class AdvancePay implements OnInit {
  advanceForm: FormGroup;

  workers = [
    { id: 1, name: 'Rahul Sharma', dept: 'Maintenance Team' },
    { id: 2, name: 'Anita Desai', dept: 'Quality Control' },
    { id: 3, name: 'James Wilson', dept: 'Logistics Fleet' },
    { id: 4, name: 'David Miller', dept: 'Site Security' },
    { id: 5, name: 'Suresh Kumar', dept: 'Floor Manager' },
  ];

  recentActivities: RecentActivity[] = [
    { id: 1, workerName: 'Rahul Sharma', department: 'Maintenance Team', amount: 5000, timeLabel: '2 HOURS AGO', reason: 'Medical emergency support' },
    { id: 2, workerName: 'Anita Desai', department: 'Quality Control', amount: 12500, timeLabel: 'YESTERDAY', reason: 'Home repair advance' },
    { id: 3, workerName: 'James Wilson', department: 'Logistics Fleet', amount: 8000, timeLabel: 'OCT 24', reason: 'Education fees' },
    { id: 4, workerName: 'David Miller', department: 'Site Security', amount: 4500, timeLabel: 'OCT 22', reason: 'Emergency travel' },
    { id: 5, workerName: 'Suresh Kumar', department: 'Floor Manager', amount: 20000, timeLabel: 'OCT 20', reason: 'Personal loan' },
  ];

  complianceStats = {
    dailyLimit: 250000,
    utilized: 45500
  };

  constructor() {
    this.advanceForm = new FormGroup({
      workerId: new FormControl('', Validators.required),
      date: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      reason: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.advanceForm.valid) {
      console.log('Advance Record Submitted:', this.advanceForm.value);
      // Here you would typically call a service to save the record
      alert('Advance Payment Recorded Successfully!');
      this.advanceForm.reset({
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
}
