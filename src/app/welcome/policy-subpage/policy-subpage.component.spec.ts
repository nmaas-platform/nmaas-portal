import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PolicySubpageComponent} from './policy-subpage.component';

describe('AcceptableUsePolicySubpageComponent', () => {
  let component: PolicySubpageComponent;
  let fixture: ComponentFixture<PolicySubpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicySubpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicySubpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
