import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppConfirmRemovalComponent} from './app-confirm-removal.component';

describe('AppConfirmRemovalComponent', () => {
  let component: AppConfirmRemovalComponent;
  let fixture: ComponentFixture<AppConfirmRemovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppConfirmRemovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppConfirmRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
