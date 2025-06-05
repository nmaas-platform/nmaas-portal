import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClusterComponent } from './add-cluster.component';

describe('AddClusterComponent', () => {
  let component: AddClusterComponent;
  let fixture: ComponentFixture<AddClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddClusterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
