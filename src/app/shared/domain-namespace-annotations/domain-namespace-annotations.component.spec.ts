import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainNamespaceAnnotationsComponent } from './domain-namespace-annotations.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DomainNamespaceAnnotationsComponent', () => {
  let component: DomainNamespaceAnnotationsComponent;
  let fixture: ComponentFixture<DomainNamespaceAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DomainNamespaceAnnotationsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    imports: [TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(DomainNamespaceAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
