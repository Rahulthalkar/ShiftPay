import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalAttendance } from './approval-attendance';

describe('ApprovalAttendance', () => {
  let component: ApprovalAttendance;
  let fixture: ComponentFixture<ApprovalAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalAttendance],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalAttendance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
