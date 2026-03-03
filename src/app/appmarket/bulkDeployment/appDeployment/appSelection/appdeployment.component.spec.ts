import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppdeploymentComponent } from './appdeployment.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('AppdeploymentComponent', () => {
  let component: AppdeploymentComponent;
  let fixture: ComponentFixture<AppdeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AppdeploymentComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterModule.forRoot([]),
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
    fixture = TestBed.createComponent(AppdeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
