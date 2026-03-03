import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalTestInstanceComponent } from './modal-test-instance.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('ModalTestInstanceComponent', () => {
  let component: ModalTestInstanceComponent;
  let fixture: ComponentFixture<ModalTestInstanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ModalTestInstanceComponent],
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
    fixture = TestBed.createComponent(ModalTestInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
