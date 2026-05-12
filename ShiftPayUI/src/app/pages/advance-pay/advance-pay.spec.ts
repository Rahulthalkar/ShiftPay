import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePay } from './advance-pay';

describe('AdvancePay', () => {
  let component: AdvancePay;
  let fixture: ComponentFixture<AdvancePay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancePay],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancePay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
