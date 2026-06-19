import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DataService } from '../../shared/service/dataservice';
import { ToastrService } from '../../shared/service/toastr.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styles: [`
    :host { display: block; }
  `]
})
export class SettingsComponent implements OnInit {
  passwordForm: FormGroup;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  showError = false;
  errorMessage = '';

  requirements = [
    { text: 'At least 8 characters long', met: false },
    { text: 'At least one uppercase letter', met: false },
    { text: 'At least one number (0-9)', met: false },
    { text: 'At least one special character (!@#$)', met: false }
  ];

  lastChanged = '';

  constructor(private dataService: DataService,
    private toastr: ToastrService,
    private location: Location) {

    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$]).*$/)
      ]),
      confirmPassword: new FormControl('', Validators.required)
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(value => {
      this.updateRequirements(value || '');
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  updateRequirements(password: string) {
    this.requirements[0].met = password.length >= 8;
    this.requirements[1].met = /[A-Z]/.test(password);
    this.requirements[2].met = /\d/.test(password);
    this.requirements[3].met = /[!@#\$]/.test(password);
  }

  toggleVisibility(field: string) {
    if (field === 'current') this.showCurrent = !this.showCurrent;
    if (field === 'new') this.showNew = !this.showNew;
    if (field === 'confirm') this.showConfirm = !this.showConfirm;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const current = this.passwordForm.get('currentPassword')?.value;
      let userId = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      let payload = {
        userId: userId.id,
        OldPassword: this.passwordForm.get('currentPassword')?.value,
        NewPassword: this.passwordForm.get('newPassword')?.value,
        confirmPassword: this.passwordForm.get('confirmPassword')?.value
      };
      this.dataService.changePassword(payload).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            this.toastr.success('Password changed successfully');
            this.passwordForm.reset();
            this.lastChanged = new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
          } else {
            alert(res.message);
          }
        },
        error: (err) => {
          this.showError = true;
          this.toastr.error("The current password you entered is incorrect. Please try again.");
          this.errorMessage = 'The current password you entered is incorrect. Please try again.';
        }
      })
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
  onCancel() {
    this.location.back();
  }

}
