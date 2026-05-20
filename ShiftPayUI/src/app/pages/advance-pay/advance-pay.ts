import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from '../../shared/service/toastr.service';
import { UserService } from '../../shared/service/users.Service';
import { AdvanceService } from '../../shared/service/advance.Service';

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

  workers: any[] = [];

  recentActivities: any[] = [
    // { id: 1, workerName: 'Rahul Sharma', department: 'Maintenance Team', amount: 5000, timeLabel: '2 HOURS AGO', reason: 'Medical emergency support' },
    // { id: 2, workerName: 'Anita Desai', department: 'Quality Control', amount: 12500, timeLabel: 'YESTERDAY', reason: 'Home repair advance' },
    // { id: 3, workerName: 'James Wilson', department: 'Logistics Fleet', amount: 8000, timeLabel: 'OCT 24', reason: 'Education fees' },
    // { id: 4, workerName: 'David Miller', department: 'Site Security', amount: 4500, timeLabel: 'OCT 22', reason: 'Emergency travel' },
    // { id: 5, workerName: 'Suresh Kumar', department: 'Floor Manager', amount: 20000, timeLabel: 'OCT 20', reason: 'Personal loan' },
  ];

  complianceStats = {
    dailyLimit: 250000,
    utilized: 45500
  };

  constructor(private userService: UserService,
    private advanceService: AdvanceService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService) {
    this.advanceForm = new FormGroup({
      id: new FormControl('', Validators.required),
      date: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      reason: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getWorkers();
    this.getAllAdvances();
  }

  getWorkers() {
    this.userService.getAllUser().subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          this.workers = res.value;
        }
        this.cdr.detectChanges();
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
          this.recentActivities = res.value;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load advances:', err);
      }
    });
  }
  onSubmit() {
    let createdBy = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    if (this.advanceForm.valid) {
      const payload = {
        userId: this.advanceForm.value.id,
        date: this.advanceForm.value.date,
        amount: this.advanceForm.value.amount,
        reason: this.advanceForm.value.reason,
        createdBy: createdBy.id
      };
      this.advanceService.create(payload).subscribe({
        next: (res: any) => {
          if (res && res.isSuccess && res.value) {
            this.toastr.success('Advance Payment Recorded Successfully!', '');
            this.advanceForm.reset({
              date: new Date().toISOString().split('T')[0]
            });
            this.getAllAdvances();
          }
          else {
            this.toastr.error('Failed to save advance', '');
          }
        },
        error: (err) => {
          console.error('Failed to save advance:', err);
          this.toastr.error('Failed to save advance', '');
        }
      });
    }
  }
}
