import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../shared/service/dataservice';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
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
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  selectedRole: 'Admin' | 'Manager' | 'Worker' = 'Admin';
  errorMessage = '';

  constructor(
    private router: Router,
    private dataservice: DataService,
    private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    });
  }

  setRole(role: 'Admin' | 'Manager' | 'Worker') {
    this.selectedRole = role;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      const loginPayload = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.dataservice.login(loginPayload).subscribe({
        next: (res: any) => {
          if (res && res.isSuccess && res.value) {
            // Save token and user session details
            this.authService.saveSession(res);

            const roleId = res.value.roleId;

            // Route based on role: 1 = Admin, 2 = Manager, 3 = Worker
            if (roleId === 1) {
              this.router.navigate(['/dashboard-admin']);
            } else if (roleId === 2) {
              this.router.navigate(['/approvalattendance']);
            } else if (roleId === 3) {
              this.router.navigate(['/workerdashboard']);
            } else {
              // Fallback routing based on UI selection if RoleId is custom
              if (this.selectedRole === 'Admin') {
                this.router.navigate(['/dashboard-admin']);
              } else if (this.selectedRole === 'Manager') {
                this.router.navigate(['/approvalattendance']);
              } else {
                this.router.navigate(['/workerdashboard']);
              }
            }
          } else {
            this.errorMessage = res?.errorMessageKey || 'Invalid username or password.';
          }
        },
        error: (err: any) => {
          console.error('Login error:', err);
          this.errorMessage = err.error?.errorMessageKey || err.error?.exceptionInfo || 'Failed to authenticate. Please check your connection.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
