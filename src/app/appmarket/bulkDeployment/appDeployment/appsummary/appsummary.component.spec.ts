import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsummaryComponent } from './appsummary.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AppsummaryComponent', () => {
  let component: AppsummaryComponent;
  let fixture: ComponentFixture<AppsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppsummaryComponent ],
      imports : [
        HttpClientTestingModule,
          ]
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
