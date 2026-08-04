import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {RegistrationComponent} from './registration.component';
import {ReCaptchaV3Service} from '../../service/recaptcha-v3.service';
import {ReactiveFormsModule} from '@angular/forms';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {RegistrationService} from '../../auth/registration.service';
import {AppConfigService, ConfigurationService} from '../../service';
import {ModalComponent} from '../modal';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('RegistrationComponent', () => {
    let component: RegistrationComponent;
    let fixture: ComponentFixture<RegistrationComponent>;

    beforeEach(waitForAsync(() => {
        const registrationServiceSpy = createSpyObj('RegistrationService', ['getDomains']);
        registrationServiceSpy.getDomains.and.returnValue(of([]));

        const configurationServiceSpy = createSpyObj('ConfigurationService', ['getConfiguration', 'updateConfiguration'])
        configurationServiceSpy.getConfiguration.and.returnValue(of())
        configurationServiceSpy.updateConfiguration.and.returnValue(of())

        TestBed.configureTestingModule({
            declarations: [RegistrationComponent, ModalComponent],
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: RegistrationService, useValue: registrationServiceSpy},
                {provide: ConfigurationService, useValue: configurationServiceSpy},
                {provide: AppConfigService, useValue: {}},
                {provide: ReCaptchaV3Service, useValue: {}},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
