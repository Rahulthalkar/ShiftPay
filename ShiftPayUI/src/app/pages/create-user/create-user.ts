import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../shared/service/users.Service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser implements OnInit {
  userForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  userId: number = 0;
  allRoles: any[] = [];
  allUsers: any[] = [];
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: [''],
      fullName: ['', Validators.required],
      RoleId: [null, Validators.required],
      imageUrl: [''],
      managerId: [null],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dailyRate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.params['id'] || 0);

    this.userService.getAllRoles().subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          this.allRoles = res.value;
        }
      },
      error: (err) => {
        console.error('Fetch roles failed:', err);
      }
    });
    this.getAllUsers();
    if (this.userId) {
      // Disable password control for editing an existing user
      this.userForm.get('password')?.disable();

      this.getUserById(this.userId);
    } else {
      // Enable password control for editing an existing user
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.imagePreview = reader.result;
          this.userForm.patchValue({ imageUrl: file.name });
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const mgrVal = this.userForm.value.managerId;
      const managerId = (mgrVal === '' || mgrVal === 0 || mgrVal === '0' || mgrVal === null || mgrVal === undefined) ? null : Number(mgrVal);

      const payload: any = {
        id: this.userId,
        username: this.userForm.value.username,
        passwordHash: this.userForm.value.password || '',
        roleId: Number(this.userForm.value.RoleId),
        fullName: this.userForm.value.fullName,
        dailyRate: Number(this.userForm.value.dailyRate),
        profileImageUrl: this.imagePreview ? String(this.imagePreview) : null,
        phoneNumber: this.userForm.value.phoneNumber,
        isActive: true,
        managerId: managerId,
        createdBy: 0
      };

      const apiCall = this.userId
        ? this.userService.updateUser(payload)
        : this.userService.createUser(payload);

      apiCall.subscribe({
        next: (res: any) => {
          if (res && res.isSuccess) {
            this.router.navigate(['/userlist']);
          } else {
            alert(res?.errorMessageKey || 'Action failed.');
          }
        },
        error: (err) => {
          console.error('Submit user failed:', err);
          alert('An error occurred during submission. Please check your data.');
        }
      });
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  getUserById(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          const user = res.value;

          this.userForm.patchValue({
            username: user.username,
            fullName: user.fullName,
            RoleId: user.roleId,
            dailyRate: user.dailyRate,
            phoneNumber: user.phoneNumber,
            managerId: user.managerId
          });

          if (user.profileImageUrl) {
            setTimeout(() => {
              this.imagePreview = user.profileImageUrl;
              this.cdr.detectChanges();
            });
          }
        }
      },
      error: (err) => {
        console.error('Fetch user failed:', err);
      }
    });
  }
  getAllUsers() {
    this.userService.getAllUser().subscribe({
      next: (res: any) => {
        if (res && res.isSuccess && res.value) {
          this.allUsers = res.value;
        }
      },
      error: (err) => {
        console.error('Fetch users failed:', err);
      }
    });
  }
  cancel() {
    this.router.navigate(['/userlist']);
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
