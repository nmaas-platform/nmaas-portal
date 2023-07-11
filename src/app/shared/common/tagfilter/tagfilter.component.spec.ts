import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagFilterComponent } from './tagfilter.component';

describe('TagfilterComponent', () => {
  let component: TagFilterComponent;
  let fixture: ComponentFixture<TagFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
 });
});
