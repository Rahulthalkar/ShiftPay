import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../shared/service/dataservice';
import { UserService } from '../../shared/service/users.Service';
import { ShiftType, UserRole } from '../../shared/interface/models';
import { ToastrService } from '../../shared/service/toastr.service';
import { authGuard } from '../../shared/guard/auth.guard';
import { AuthService } from '../../shared/service/auth.service';


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
  userId: any;
  userRoleId: number = 0;
  fullName: string = '';
  readonly UserRole = UserRole;
  entryMode: 'self' | 'supervisor' = 'self';

  shiftTypes = Object.keys(ShiftType)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      id: ShiftType[key as keyof typeof ShiftType],
      name: key
    }));

  history: SessionHistory[] = [];

  constructor(private dataService: DataService, private fb: FormBuilder,
    private userService: UserService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private authService: AuthService
  ) {
    const loggedInUser = this.authService.currentUserValue;
    if (loggedInUser) {
      this.userId = loggedInUser.id;
      this.userRoleId = loggedInUser.roleId;
      this.fullName = loggedInUser.firstName || loggedInUser.userName || '';
    }

    const todayStr = new Date().toISOString().split('T')[0];

    this.workForm = this.fb.group({
      id: [this.userRoleId === UserRole.Worker ? this.userId : '', Validators.required],
      shiftType: ['', Validators.required],
      date: [todayStr, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: []
    });
  }

  ngOnInit() {
    if (this.userRoleId === UserRole.Worker) {
      this.entryMode = 'self';
      this.workers = [{
        id: this.userId,
        fullName: this.fullName
      }];
    } else {
      this.entryMode = 'supervisor';
      this.getWorkersBySupervisorId();
    }
  }

  getWorkersBySupervisorId() {
    this.userService.getWorkersBySupervisorId(this.userId).subscribe(
      (response) => {

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
    if (this.workForm.invalid) {
      this.workForm.markAllAsTouched();
      this.toaster.error('Please fill in all required fields correctly.');
      return;
    }

    const formValue = this.workForm.value;
    const currentUser = this.userId;
    const attendanceData = {
      userId: formValue.id ?? currentUser,
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

  setEntryMode(mode: 'self' | 'supervisor') {
    this.entryMode = mode;
    if (mode === 'self') {
      this.workForm.patchValue({
        id: this.userId
      });
    } else {
      this.workForm.patchValue({
        id: this.workers[0]?.id || ''
      });
    }
  }

  resetForm() {
    const todayStr = new Date().toISOString().split('T')[0];
    this.entryMode = this.userRoleId === UserRole.Worker ? 'self' : 'supervisor';
    this.workForm.reset({
      id: this.entryMode === 'self' ? this.userId : (this.workers[0]?.id || ''),
      shiftType: this.shiftTypes[0]?.id || '',
      date: todayStr,
      startTime: '',
      endTime: '',
      status: false
    });
  }
}
