import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainNavigatorComponent } from './domain-navigator.component';

describe('DomainnavigatorComponent', () => {
  let component: DomainNavigatorComponent;
  let fixture: ComponentFixture<DomainNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
