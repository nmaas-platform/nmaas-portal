import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkListComponent } from './bulk-list.component';

describe('BulkListComponent', () => {
  let component: BulkListComponent;
  let fixture: ComponentFixture<BulkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
