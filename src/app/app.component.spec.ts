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
                AppComponent
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
                {provide: AppConfigService, useClass: MockConfigurationService},
                ConfigurationService,
                TranslateService,
                AuthService,
                JwtHelperService,
                {provide: ServiceUnavailableService, useClass: MockServiceUnavailableService}
            ]
        });
    });

    it('should create the app', waitForAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
