import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalProvideSshKeyComponent } from './modal-provide-ssh-key.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ModalComponent} from '../modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ModalProvideSshKeyComponent', () => {
  let component: ModalProvideSshKeyComponent;
  let fixture: ComponentFixture<ModalProvideSshKeyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ModalProvideSshKeyComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
