import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalTestInstanceComponent } from './modal-test-instance.component';

describe('ModalTestInstanceComponent', () => {
  let component: ModalTestInstanceComponent;
  let fixture: ComponentFixture<ModalTestInstanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTestInstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTestInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
