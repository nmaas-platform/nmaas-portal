import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainNamespaceAnnotationsComponent } from './domain-namespace-annotations.component';

describe('DomainNamespaceAnnotationsComponent', () => {
  let component: DomainNamespaceAnnotationsComponent;
  let fixture: ComponentFixture<DomainNamespaceAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainNamespaceAnnotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainNamespaceAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
