import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainsummaryComponent } from './domainsummary.component';

describe('DomainsummaryComponent', () => {
  let component: DomainsummaryComponent;
  let fixture: ComponentFixture<DomainsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainsummaryComponent ]
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
