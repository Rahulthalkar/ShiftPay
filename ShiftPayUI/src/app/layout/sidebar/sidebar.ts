import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() closeSidebar = new EventEmitter<void>();

  private router = inject(Router)
  onClose() {
    this.closeSidebar.emit();
  }
  logout() {
    this.router.navigateByUrl('/login');
    const isValid = sessionStorage.getItem("currentUser");
    if (isValid) {
      sessionStorage.clear();
      sessionStorage.removeItem('currentUser');
    }
  }

  onNavClick() {
    if (window.innerWidth < 1024) {
      this.closeSidebar.emit();
    }
  }
}
