import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCreatorComponent } from './budget-creator.component';

describe('BudgetCreatorComponent', () => {
  let component: BudgetCreatorComponent;
  let fixture: ComponentFixture<BudgetCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
