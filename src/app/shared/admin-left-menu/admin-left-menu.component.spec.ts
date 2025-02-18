import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeftMenuComponent } from './admin-left-menu.component';

describe('AdminLeftMenuComponent', () => {
  let component: AdminLeftMenuComponent;
  let fixture: ComponentFixture<AdminLeftMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeftMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
