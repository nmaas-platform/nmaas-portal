import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovalConfirmationModalComponent } from './removal-confirmation-modal.component';

describe('RemovalConfirmationModalComponent', () => {
  let component: RemovalConfirmationModalComponent;
  let fixture: ComponentFixture<RemovalConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemovalConfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovalConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
