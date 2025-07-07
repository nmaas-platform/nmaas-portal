import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalNotificationSendComponent } from './modal-notification-send.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalComponent} from '../modal.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {ToastContainerComponent} from '../../toast-container/toast-container.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ModalNotificationSendComponent', () => {
  let component: ModalNotificationSendComponent;
  let fixture: ComponentFixture<ModalNotificationSendComponent>;
  let mockToast: jasmine.SpyObj<ToastContainerComponent>;

  beforeEach(waitForAsync(() => {
    mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);
    TestBed.configureTestingModule({
    declarations: [ModalNotificationSendComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    imports: [TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        { provide: ToastContainerComponent, useValue: mockToast },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNotificationSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
