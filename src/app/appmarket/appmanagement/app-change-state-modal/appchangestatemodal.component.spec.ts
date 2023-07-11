import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppChangeStateModalComponent } from './appchangestatemodal.component';

describe('AppchangestatemodalComponent', () => {
  let component: AppChangeStateModalComponent;
  let fixture: ComponentFixture<AppChangeStateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppChangeStateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppChangeStateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
