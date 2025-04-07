import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterManagerComponent } from './manager.component';

describe('ManagerComponent', () => {
  let component: ClusterManagerComponent;
  let fixture: ComponentFixture<ClusterManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusterManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClusterManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
