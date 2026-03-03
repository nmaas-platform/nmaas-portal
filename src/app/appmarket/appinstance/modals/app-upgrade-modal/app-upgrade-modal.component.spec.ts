import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppUpgradeModalComponent } from './app-upgrade-modal.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('AppUpgradeModalComponent', () => {
  let component: AppUpgradeModalComponent;
  let fixture: ComponentFixture<AppUpgradeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [AppUpgradeModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
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
    fixture = TestBed.createComponent(AppUpgradeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
