import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('ShiftPayUI');
  isDarkMode = false;
  isSidebarOpen = true;
  isAuthRoute = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isAuthRoute = url.includes('/login') || url.includes('/forgot-password') || url.includes('/reset-password');
      
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 1024) {
        this.isSidebarOpen = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
  
    const currentUrl = this.router.url;
    this.isAuthRoute = currentUrl.includes('/login') || currentUrl.includes('/forgot-password') || currentUrl.includes('/reset-password');
    
    this.checkScreenSize();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
    }
    this.applyTheme();
  }

  private checkScreenSize() {
    if (window.innerWidth >= 1024) {
      this.isSidebarOpen = true;
    } else {
      // On mobile, default to closed if we just resized down
      // but only if it wasn't already explicitly handled
      // For simplicity, we just set it to false on mobile resize
      // unless the user just opened it.
      // But actually, let's just ensure it's open on LG.
      if (!this.isSidebarOpen && window.innerWidth >= 1024) {
        this.isSidebarOpen = true;
      }
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
