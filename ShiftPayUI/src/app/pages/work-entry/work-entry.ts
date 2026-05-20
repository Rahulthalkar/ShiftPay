import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../shared/service/dataservice';
import { UserService } from '../../shared/service/users.Service';
import { ShiftType } from '../../shared/interface/models';
import { ToastrService } from '../../shared/service/toastr.service';


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

  workers: any[] = [];

  shiftTypes = Object.keys(ShiftType)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      id: ShiftType[key as keyof typeof ShiftType],
      name: key
    }));

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

  constructor(private dataService: DataService, private fb: FormBuilder,
    private userService: UserService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {
    this.workForm = this.fb.group({
      id: [0, Validators.required],
      shiftType: ['', Validators.required],
      date: [new Date().getDate(), Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: []
    });
  }

  ngOnInit() {
    this.getAllWorkers();
  }

  getAllWorkers() {
    this.userService.getAllUser().subscribe(
      (response) => {
        console.log('Workers fetched successfully:', response);
        if (response && response.isSuccess && response.value) {
          this.workers = response.value;
        } else if (Array.isArray(response)) {
          this.workers = response;
        }
      },
      (error) => {
        console.error('Error fetching workers:', error);
      }
    );
  }

  markAttendance() {
    const formValue = this.workForm.value;
    const selectedWorker = this.workers.find(w => w.id == formValue.id);
    const attendanceData = {
      userId: formValue.id,
      status: false,
      shiftType: formValue.shiftType,
      date: formValue.date,
      startTime: formValue.startTime,
      endTime: formValue.endTime
    };

    this.dataService.markAttendance(attendanceData).subscribe({
      next: (res: any) => {
        if (res && res.isSuccess) {
          this.toaster.success(res?.errorMessageKey);
          this.location.back();
          this.cdr.detectChanges();
          this.resetForm();
        } else {
          this.toaster.error(res?.errorMessageKey || 'Failed to save work entry. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error marking attendance:', error);
        this.toaster.error(error?.error?.errorMessageKey || 'Failed to save work entry. Please try again.');
      }
    });
  }

  resetForm() {
    this.workForm.reset({
      userId: this.workers[0]?.id || 0,
      shiftType: this.shiftTypes[3],
      date: '2023-10-24',
      startTime: '21:00',
      endTime: '03:00'
    });
  }
}
