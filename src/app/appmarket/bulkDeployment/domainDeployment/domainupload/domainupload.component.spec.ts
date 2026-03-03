import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainuploadComponent } from './domainupload.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('DomainuploadComponent', () => {
  let component: DomainuploadComponent;
  let fixture: ComponentFixture<DomainuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DomainuploadComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    imports: [RouterTestingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
