import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  constructor() {
    this.profileForm = new FormGroup({
      name: new FormControl(this.user.name),
      employeeId: new FormControl(this.user.id),
      email: new FormControl(this.user.email),
      phone: new FormControl(this.user.phone)
    });
  }

  ngOnInit() { }
}
