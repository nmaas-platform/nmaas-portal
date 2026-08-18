import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdminDashboardComponent } from './group-admin-dashboard.component';

describe('GroupAdminDashboardComponent', () => {
  let component: GroupAdminDashboardComponent;
  let fixture: ComponentFixture<GroupAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAdminDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAdminDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
