import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isDarkMode = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();

  userName: string = '';
  userRole: string = '';

  private userSub!: Subscription;
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.firstName || user.userName || '';
        const roleMap: { [key: number]: string } = {
          1: 'Admin',
          2: 'Manager',
          3: 'Worker'
        };
        this.userRole = roleMap[user.roleId] || 'User';
      } else {
        this.userName = '';
        this.userRole = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onToggleTheme() {
    this.toggleTheme.emit();
  }
}
