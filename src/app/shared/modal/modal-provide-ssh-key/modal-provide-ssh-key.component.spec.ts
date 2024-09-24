import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalProvideSshKeyComponent } from './modal-provide-ssh-key.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ModalComponent} from '../modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ModalProvideSshKeyComponent', () => {
  let component: ModalProvideSshKeyComponent;
  let fixture: ComponentFixture<ModalProvideSshKeyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProvideSshKeyComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProvideSshKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
