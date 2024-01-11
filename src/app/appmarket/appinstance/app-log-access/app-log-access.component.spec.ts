import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppLogAccessComponent} from './app-log-access.component';

describe('AppLogAccessComponent', () => {
  let component: AppLogAccessComponent;
  let fixture: ComponentFixture<AppLogAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppLogAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppLogAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
