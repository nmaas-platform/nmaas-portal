import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainAnnotationsComponent } from './domain-annotations.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {  TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('DomainAnnotationsComponent', () => {
  let component: DomainAnnotationsComponent;
  let fixture: ComponentFixture<DomainAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DomainAnnotationsComponent],
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

    fixture = TestBed.createComponent(DomainAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
