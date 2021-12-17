import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppRestartModalComponent } from './app-restart-modal.component';

describe('AppRestartModalComponent', () => {
  let component: AppRestartModalComponent;
  let fixture: ComponentFixture<AppRestartModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppRestartModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppRestartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
