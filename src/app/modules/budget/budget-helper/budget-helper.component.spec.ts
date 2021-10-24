import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetHelperComponent } from './budget-helper.component';

describe('BudgetHelperComponent', () => {
  let component: BudgetHelperComponent;
  let fixture: ComponentFixture<BudgetHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetHelperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
