import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ConfigurationDetailsComponent} from './configurationdetails.component';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {ConfigurationService, DomainService} from '../../../../service';
import {of} from 'rxjs';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {InternationalizationService} from '../../../../service/internationalization.service';
import createSpyObj = jasmine.createSpyObj;
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {ToastContainerComponent} from '../../../../shared/toast-container/toast-container.component';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}


describe('ConfigurationDetailsComponent', () => {
    let component: ConfigurationDetailsComponent;
    let fixture: ComponentFixture<ConfigurationDetailsComponent>;
    let mockToast: jasmine.SpyObj<ToastContainerComponent>;

    beforeEach(waitForAsync(() => {
        const internationalizationSpy = createSpyObj('InternationalizationService', ['getEnabledLanguages', 'getAllSupportedLanguages'])
        internationalizationSpy.getAllSupportedLanguages.and.returnValue(of([]))
        internationalizationSpy.getEnabledLanguages.and.returnValue(of(['en', 'pl']))

        const configurationServiceSpy = createSpyObj('ConfigurationService', ['getConfiguration', 'updateConfiguration'])
        configurationServiceSpy.getConfiguration.and.returnValue(of())
        configurationServiceSpy.updateConfiguration.and.returnValue(of())
        mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);

        const domainServiceSpy = createSpyObj('DomainService', ['getAll']);
        domainServiceSpy.getAll.and.returnValue(of([]))

        TestBed.configureTestingModule({
            declarations: [ConfigurationDetailsComponent],
            imports: [
                FormsModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: ConfigurationService, useValue: configurationServiceSpy},
                {provide: InternationalizationService, useValue: internationalizationSpy},
                { provide: ToastContainerComponent, useValue: mockToast },
                {provide: DomainService, useValue: domainServiceSpy}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigurationDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
