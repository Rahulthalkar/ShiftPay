import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface SessionHistory {
  name: string;
  initials: string;
  avatarColor: string;
  date: string;
  shiftType: string;
  shiftClass: string;
  duration: string;
  amount: string;
}

@Component({
  selector: 'app-work-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './work-entry.html',
  styles: [`
    :host { display: block; }
  `]
})
export class WorkEntryComponent implements OnInit {
  workForm: FormGroup;
  
  workers = ['Rahul Sharma (W-102)', 'Anita Desai (W-105)', 'John Smith (W-109)'];
  shiftTypes = ['Day Shift', 'Half Night', 'Full Night', 'Double Night'];

  history: SessionHistory[] = [
    {
      name: 'Rahul Sharma',
      initials: 'RS',
      avatarColor: 'bg-slate-100 text-slate-500',
      date: 'Yesterday, Oct 23',
      shiftType: 'FULL NIGHT',
      shiftClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      duration: '8.5h',
      amount: '₹2,975'
    },
    {
      name: 'Anita Desai',
      initials: 'AD',
      avatarColor: 'bg-indigo-50 text-indigo-600',
      date: 'Oct 23, 08:00 AM',
      shiftType: 'DAY SHIFT',
      shiftClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      duration: '9.0h',
      amount: '₹3,150'
    }
  ];

  constructor() {
    this.workForm = new FormGroup({
      worker: new FormControl(this.workers[0]),
      shiftType: new FormControl(this.shiftTypes[3]),
      date: new FormControl('2023-10-24'),
      startTime: new FormControl('21:00'),
      endTime: new FormControl('03:00')
    });
  }

  ngOnInit() {}

  resetForm() {
    this.workForm.reset({
      worker: this.workers[0],
      shiftType: this.shiftTypes[3],
      date: '2023-10-24',
      startTime: '21:00',
      endTime: '03:00'
    });
  }
}
