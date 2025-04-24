/* tslint:disable:no-unused-variable */

import {TestBed, waitForAsync} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AppConfigService, ConfigurationService} from './service';
import {MissingTranslationHandler, TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {Configuration} from './model/configuration';
import {CustomMissingTranslationService} from './i18n/custommissingtranslation.service';
import {AuthService} from './auth/auth.service';
import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import {ServiceUnavailableService} from './service-unavailable/service-unavailable.service';
import {SharedModule} from './shared';
import { LeftMenuComponent } from './shared/left-menu/left-menu.component';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';

class MockConfigurationService {
    protected uri: string;

    constructor() {
        this.uri = 'http://localhost/api';
    }

    public getApiUrl(): string {
        return 'http://localhost/api';
    }

    public getConfiguration(): Observable<Configuration> {
        return of<Configuration>();
    }

    public updateConfiguration(configuration: Configuration): Observable<any> {
        return of<Configuration>();
    }
}

class MockAppConfigService {
    config: any;
  
    constructor() { }
  
    public load() {
    }
  
    public getApiUrl(): string {
      return '';
    }
  
    public getNmaasGlobalDomainId(): number {
      return 0;
    }
  
    public getHttpTimeout(): number {
      return 10000;
    }
  
    public getShowGitInfo(): boolean {
      return false;
    }
  
    public getShowChangelog(): boolean {
      return false;
    }
  }

class MockServiceUnavailableService {
    public isServiceAvailable: boolean;

    constructor() {
        this.isServiceAvailable = true;
    }
}

describe('App: NmaasPortal', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                LeftMenuComponent,
                ToastContainerComponent
            ],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationService},
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
                JwtModule.forRoot({
                    config: {
                        tokenGetter: () => {
                            return '';
                        }
                    }
                }),
                SharedModule
            ],
            providers: [
                {provide: AppConfigService, useClass: MockAppConfigService},
                {provide: ConfigurationService, useClass: MockConfigurationService},
                TranslateService,
                AuthService,
                JwtHelperService,
            MessageService,
                {provide: ServiceUnavailableService, useClass: MockServiceUnavailableService}
        ],
        schemas: [
                      CUSTOM_ELEMENTS_SCHEMA,
                      NO_ERRORS_SCHEMA
                      ]
        });
    });

    it('should create the app', waitForAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
