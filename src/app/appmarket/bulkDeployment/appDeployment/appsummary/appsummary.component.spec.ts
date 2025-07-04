import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsummaryComponent } from './appsummary.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppsummaryComponent', () => {
  let component: AppsummaryComponent;
  let fixture: ComponentFixture<AppsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AppsummaryComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
