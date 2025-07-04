import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalGuestUserComponent } from './modal-guest-user.component';
import {Component} from '@angular/core';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ModalComponent} from '../../../shared/modal';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
    selector: 'nmaas-modal',
    template: '<p>Modal Mock</p>',
    standalone: false
})
class ModalMock {
  setModalType(arg: string) {

  }
  setStatusOfIcons(arg: boolean) {

  }
}

describe('ModalGuestUserComponent', () => {
  let component: ModalGuestUserComponent;
  let fixture: ComponentFixture<ModalGuestUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGuestUserComponent, ModalComponent ],
      imports: [
        DialogModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGuestUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
