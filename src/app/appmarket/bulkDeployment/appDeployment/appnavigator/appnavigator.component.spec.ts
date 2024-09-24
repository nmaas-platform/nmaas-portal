import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppnavigatorComponent } from './appnavigator.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppnavigatorComponent', () => {
  let component: AppnavigatorComponent;
  let fixture: ComponentFixture<AppnavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppnavigatorComponent ],
      imports : [
          HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
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
