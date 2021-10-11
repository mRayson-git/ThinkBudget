import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransModalComponent } from './trans-modal.component';

describe('TransModalComponent', () => {
  let component: TransModalComponent;
  let fixture: ComponentFixture<TransModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
