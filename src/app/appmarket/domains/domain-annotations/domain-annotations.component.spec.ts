import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainAnnotationsComponent } from './domain-annotations.component';

describe('DomainAnnotationsComponent', () => {
  let component: DomainAnnotationsComponent;
  let fixture: ComponentFixture<DomainAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainAnnotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
