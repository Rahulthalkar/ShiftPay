import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Shift {
  date: string;
  type: string;
  salary: number;
}

interface Advance {
  date: string;
  reason: string;
  amount: number;
}

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './worker-dashboard.html',
  styleUrl: './worker-dashboard.css',
})
export class WorkerDashboard implements OnInit {
  workerName: string = 'David';
  dailyRate: number = 550;
  currentDate: string = 'April 29, 2024';
  
  startDate: string = '2024-04-01';
  endDate: string = '2024-04-29';

  stats = {
    daysWorked: 0,
    halfDays: 0,
    secondHalf: 0,
    fullNight: 0,
    halfNight: 0,
    doubleNight: 0,
    totalSalary: 0,
    balance: 0,
    totalShifts: 0,
    salaryEarned: 0,
    advancesTaken: 0,
    workingDays: 0
  };

  recentShifts: Shift[] = [];
  recentAdvances: Advance[] = [];

  // Calendar mock data
  calendarDays: any[] = [];

  ngOnInit() {
    this.generateCalendar();
    this.loadMockData();
  }

  loadMockData() {
    // In a real app, this would come from a service
    this.stats = {
      daysWorked: 0,
      halfDays: 0,
      secondHalf: 0,
      fullNight: 0,
      halfNight: 0,
      doubleNight: 0,
      totalSalary: 0,
      balance: 0,
      totalShifts: 0,
      salaryEarned: 0,
      advancesTaken: 0,
      workingDays: 0
    };
  }

  generateCalendar() {
    // Generate days for April 2024
    const daysInMonth = 30;
    const startDay = 1; // Monday
    
    for (let i = 0; i < startDay; i++) {
      this.calendarDays.push({ day: null });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({ 
        day: i, 
        current: i === 29,
        type: i === 29 ? 'selected' : null
      });
    }
  }

  onFilter() {
    console.log('Filtering from', this.startDate, 'to', this.endDate);
  }
}
