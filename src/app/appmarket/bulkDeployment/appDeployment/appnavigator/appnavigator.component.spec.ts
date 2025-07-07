import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppnavigatorComponent } from './appnavigator.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppnavigatorComponent', () => {
  let component: AppnavigatorComponent;
  let fixture: ComponentFixture<AppnavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AppnavigatorComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterModule.forRoot([])],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppnavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
