import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDomainListComponent } from './user-domain-list.component';

describe('DomainListComponent', () => {
  let component: UserDomainListComponent;
  let fixture: ComponentFixture<UserDomainListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDomainListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserDomainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
