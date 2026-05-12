import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedList } from './advanced-list';

describe('AdvancedList', () => {
  let component: AdvancedList;
  let fixture: ComponentFixture<AdvancedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedList],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
