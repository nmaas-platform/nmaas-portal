import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalNotificationSendComponent } from './modal-notification-send.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalComponent} from '../modal.component';

describe('ModalNotificationSendComponent', () => {
  let component: ModalNotificationSendComponent;
  let fixture: ComponentFixture<ModalNotificationSendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNotificationSendComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNotificationSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
