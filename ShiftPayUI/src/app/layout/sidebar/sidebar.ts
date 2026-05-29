import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/service/auth.service';
import { UserRole } from '../../shared/interface/models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = true;
  @Output() closeSidebar = new EventEmitter<void>();

  userRoleId: number = 0;
  readonly UserRole = UserRole;
  private userSub!: Subscription;

  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.userRoleId = user?.roleId || 0;
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  onClose() {
    this.closeSidebar.emit();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  onNavClick() {
    if (window.innerWidth < 1024) {
      this.closeSidebar.emit();
    }
  }
}
