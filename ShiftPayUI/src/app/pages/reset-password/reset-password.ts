import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../shared/service/dataservice';
import { ToastrService } from '../../shared/service/toastr.service';
import { finalize } from 'rxjs/operators';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styles: []
})
export class ResetPassword implements OnInit {
  isLoading = false;
  isValidating = true;
  isLinkValid = false;

  guid: string = '';
  userId: number = 0;

  resetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.resetForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: passwordMatchValidator });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.guid = params.get('guid') || params.get('id') || '';

      if (!this.guid) {
        // Fallback to queryParams in case it's implemented that way
        this.route.queryParamMap.subscribe(qParams => {
          this.guid = qParams.get('guid') || qParams.get('token') || '';
          this.validateGuid();
        });
      } else {
        this.validateGuid();
      }
    });
  }

  validateGuid() {
    if (!this.guid) {
      this.isValidating = false;
      this.isLinkValid = false;
      this.toastr.error('Invalid password reset link.');
      return;
    }

    this.isValidating = true;
    this.dataService.validateResetPasswordGUID(this.guid)
      .pipe(finalize(() => {
        this.isValidating = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res: any) => {
          if (res && res.isSuccess) {
            this.isLinkValid = true;
            // Handle case sensitivity for JSON properties
            this.userId = res.value?.id || res.value?.Id;
          } else {
            this.isLinkValid = false;
            this.toastr.error(res?.errorMessageKey || res?.exceptionInfo || 'This password reset link is invalid or has expired.');
          }
        },
        error: (err: any) => {
          this.isLinkValid = false;
          this.toastr.error('An error occurred while validating the reset link.');
        }
      });
  }

  onSubmit() {
    if (this.resetForm.valid && this.isLinkValid) {
      this.isLoading = true;
      const payload = {
        userId: this.userId,
        resetPasswordGuid: this.guid,
        newPassword: this.resetForm.value.newPassword
      };

      this.dataService.resetPassword(payload)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }))
        .subscribe({
          next: (res: any) => {
            if (res && res.isSuccess) {
              this.toastr.success('Password has been reset successfully.');
              this.router.navigate(['/login']);
            } else {
              this.toastr.error(res?.errorMessageKey || res?.exceptionInfo || 'Failed to reset password.');
            }
          },
          error: (err: any) => {
            this.toastr.error(err.error?.errorMessageKey || 'An error occurred. Please try again.');
          }
        });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
