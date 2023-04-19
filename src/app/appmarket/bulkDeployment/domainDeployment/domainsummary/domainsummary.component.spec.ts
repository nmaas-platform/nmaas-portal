import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainsummaryComponent } from './domainsummary.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DomainsummaryComponent', () => {
  let component: DomainsummaryComponent;
  let fixture: ComponentFixture<DomainsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainsummaryComponent ],
      imports: [
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
