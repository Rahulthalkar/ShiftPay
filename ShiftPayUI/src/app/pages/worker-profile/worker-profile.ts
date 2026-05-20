import { CommonModule, Location } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../shared/service/users.Service';
import { AuthService } from '../../shared/service/auth.service';
import { ToastrService } from '../../shared/service/toastr.service';

@Component({
  selector: 'app-worker-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './worker-profile.html',
  styles: [`
    :host { display: block; }
  `]
})
export class WorkerProfileComponent implements OnInit {
  profileForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  loadedUser: any = null;

  user = {
    name: 'Alexander Sterling',
    id: 'EMP-2024-0892',
    email: 'alex.sterling@precisionledger.com',
    phone: '+1 (555) 012-3456',
    role: 'Senior Logistics Analyst',
    earnings: '$4,280',
    lastPasswordChange: '14 days ago'
  };

  credentials = [
    {
      title: 'Safety Certification',
      info: 'Expires: Oct 2025',
      linkText: 'View Document',
      icon: 'shield-check'
    },
    {
      title: 'System Access: Tier 2',
      info: 'Authorized: Ledger V3.4',
      linkText: 'Request Upgrade',
      icon: 'key'
    },
    {
      title: 'Labor Agreement',
      info: 'Signed: Jan 2024',
      linkText: 'Download Copy',
      icon: 'file-text'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      id: [{ value: '', disabled: true }],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      roleName: [{ value: '', disabled: true }],
      profileImageUrl: []
    });
  }

  ngOnInit() {
    const userId = this.authService.currentUserValue?.id || 1;
    this.userService.getUserById(userId).subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          this.loadedUser = res.value;
          this.profileForm.patchValue(res.value);
          if (res.value.profileImageUrl) {
            this.imagePreview = res.value.profileImageUrl;
          }
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  get initials(): string {
    const fullName = this.profileForm.get('fullName')?.value || '';
    if (!fullName) return '??';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.imagePreview = reader.result;
          this.profileForm.patchValue({ profileImageUrl: file.name });
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    if (this.profileForm.valid && this.loadedUser) {
      const payload = {
        ...this.loadedUser,
        fullName: this.profileForm.getRawValue().fullName,
        username: this.profileForm.getRawValue().username,
        phoneNumber: this.profileForm.getRawValue().phoneNumber,
        profileImageUrl: this.imagePreview ? String(this.imagePreview) : null
      };

      this.userService.updateUser(payload).subscribe({
        next: (res: any) => {
          if (res && res.isSuccess) {
            //alert('Profile updated successfully!');
            this.toastr.success('Profile updated successfully');
            // Update session storage if current user's profile was updated
            if (this.authService.currentUserValue?.id === payload.id) {
              const currentUser = this.authService.currentUserValue;
              currentUser.firstName = payload.fullName.split(' ')[0];
              currentUser.userName = payload.username;
              sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            this.location.back();
            this.cdr.detectChanges();
          } else {
            this.toastr.error(res?.errorMessageKey || 'Update failed.');
          }
        },
        error: (err) => {
          this.toastr.error('Failed to update profile.');
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  cancel() {
    this.location.back();
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
