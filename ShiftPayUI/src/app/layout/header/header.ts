import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit{
  @Input() isDarkMode = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();

  userName: string = '';
  userRole: string = '';

  ngOnInit(): void {
    const currentUser = sessionStorage.getItem('currentUser');
    console.log(currentUser);
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.userName = user.firstName || user.userName || '';
      const roleMap: { [key: number]: string } = {
        1: 'Admin',
        2: 'Manager',
        3: 'Worker'
      };
      this.userRole = roleMap[user.roleId] || 'User';
    }
  }
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onToggleTheme() {
    this.toggleTheme.emit();
  }
}
