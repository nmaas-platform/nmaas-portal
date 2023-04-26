import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAppListComponent } from './bulk-app-list.component';

describe('BulkAppListComponent', () => {
  let component: BulkAppListComponent;
  let fixture: ComponentFixture<BulkAppListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAppListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
