import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
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
      console.log('Login attempt with role:', this.selectedRole, this.loginForm.value);
      // Mock login routing
      if (this.selectedRole === 'Admin') {
        this.router.navigate(['/dashboard-admin']);
      } else {
        this.router.navigate(['/dashboard-admin']); // Modify as needed
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
