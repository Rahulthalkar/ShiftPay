import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../shared/service/dataservice';
import { ToastrService } from '../../shared/service/toastr.service';
import { finalize } from 'rxjs/operators';
import { ResetRequestModel } from '../../shared/interface/models';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styles: [`
    :host { display: block; height: 100%; width: 100%; }
    .bg-grid-pattern {
      background-image: linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .dark .bg-grid-pattern {
      background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.9); opacity: 0.6; }
      50% { transform: scale(1.05); opacity: 0.3; }
      100% { transform: scale(0.9); opacity: 0.6; }
    }
    .animate-pulse-ring {
      animation: pulse-ring 2s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class ForgotPasswordComponent {
  isLoading = false;

  // Step 1: Email form
  emailForm: FormGroup;
  baseUrl: string = '';
  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  // Step 1: Submit email to request OTP
  onSubmitEmail() {
    if (this.emailForm.valid) {
      this.isLoading = true;
      let data: ResetRequestModel = {
        email: this.emailForm.value.email,
        baseUrl: window.location.origin
      }
      this.dataService.forgotPassword(data)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }))
        .subscribe({
          next: (res: any) => {
            if (res && res.isSuccess) {
              this.toastr.success('Verification code sent to your email.');
              this.emailForm.reset();
            } else {
              this.toastr.error(res?.errorMessageKey || 'Failed to send verification code.');
            }
          },
          error: (err: any) => {
            this.toastr.error(err.error?.errorMessageKey || 'Failed to send verification code. Please try again.');
          }
        });
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  // Resend OTP
  resendOtp() {
    this.isLoading = true;
    this.dataService.forgotPassword(this.emailForm.value.email)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res: any) => {
          this.toastr.success('A new verification code has been sent.');
        },
        error: (err: any) => {
          this.toastr.error('Failed to resend code. Please try again.');
        }
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
