import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleListComponent } from './bundle-list.component';

describe('BundleListComponent', () => {
  let component: BundleListComponent;
  let fixture: ComponentFixture<BundleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BundleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BundleListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
