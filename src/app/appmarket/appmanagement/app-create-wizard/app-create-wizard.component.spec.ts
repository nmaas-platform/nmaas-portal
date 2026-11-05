import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AppCreateWizardComponent} from './app-create-wizard.component';
import {AppImagesService, AppsService, TagService} from '../../../service';
import {RouterTestingModule} from '@angular/router/testing';
import {InternationalizationService} from '../../../service/internationalization.service';
import {ConfigTemplateService} from '../../../service/configtemplate.service';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {StepsModule} from 'primeng/steps';
import {SharedModule} from '../../../shared';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {ToastContainerComponent} from "../../../shared/toast-container/toast-container.component";

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('AppCreateWizardComponent', () => {
    let component: AppCreateWizardComponent;
    let fixture: ComponentFixture<AppCreateWizardComponent>;
    let mockToast: jasmine.SpyObj<ToastContainerComponent>;
    let configTemplateServiceSpy: jasmine.SpyObj<ConfigTemplateService>;

    let appsService: AppsService = undefined;
    let appImagesService = undefined;

    beforeEach(waitForAsync(() => {
        const tagServiceSpy = createSpyObj('TagService', ['getTags'])
        tagServiceSpy.getTags.and.returnValue(of([]))

        const internationalizationSpy = createSpyObj('InternationalizationService', ['getAllSupportedLanguages'])
        internationalizationSpy.getAllSupportedLanguages.and.returnValue(of([
            { language: 'en', enabled: true, content: {} },
            { language: 'en', enabled: true, content: {} },
        ]))

        configTemplateServiceSpy = createSpyObj('ConfigTemplateService',
            ['getConfigTemplate', 'getConfigUpdateTemplate', 'generateConfigUpdateTemplate', 'isTemplateEmpty'])
        mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);

        TestBed.configureTestingModule({
            declarations: [AppCreateWizardComponent],
            imports: [
                StepsModule,
                SharedModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: TagService, useValue: tagServiceSpy},
                {provide: AppsService, useValue: {}},
                {provide: InternationalizationService, useValue: internationalizationSpy},
                {provide: ConfigTemplateService, useValue: configTemplateServiceSpy},
                {provide: AppImagesService, useValue: {}},
                {provide: ToastContainerComponent, useValue: mockToast}
            ],
            schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppCreateWizardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        appsService = TestBed.inject(AppsService)
        appImagesService = TestBed.inject(AppImagesService)
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('handleConfigTemplate', () => {

        beforeEach(() => {
            component.applicationDTO = {
                application: {
                    appConfigurationSpec: { configUpdateEnabled: true },
                    configWizardTemplate: { id: null, template: { components: [] } },
                    configUpdateWizardTemplate: null
                }
            } as any;
        });

        it('should generate a default update template from the main config wizard when the update wizard is null', () => {
            const generated = {
                components: [
                    {
                        type: 'container', input: true, key: 'additionalParameters',
                        components: [{ type: 'textfield', input: true, key: 'server_dot_extraArgs' }]
                    }
                ]
            };
            configTemplateServiceSpy.isTemplateEmpty.and.returnValue(true);
            configTemplateServiceSpy.generateConfigUpdateTemplate.and.returnValue(generated);
            component.addConfigUpdate = true;

            component.handleConfigTemplate();

            expect(configTemplateServiceSpy.generateConfigUpdateTemplate)
                .toHaveBeenCalledWith({ components: [] });
            expect(component.applicationDTO.application.configUpdateWizardTemplate.template).toEqual(generated);
        });

        it('should keep the existing update template when it is not empty', () => {
            const existing = {
                id: 1,
                template: {
                    components: [
                        {
                            type: 'container', input: true, key: 'accessCredentials',
                            components: [{ type: 'textfield', input: true, key: 'accessUsername' }]
                        }
                    ]
                }
            };
            component.applicationDTO.application.configUpdateWizardTemplate = existing;
            configTemplateServiceSpy.isTemplateEmpty.and.returnValue(false);
            component.addConfigUpdate = true;

            component.handleConfigTemplate();

            expect(component.applicationDTO.application.configUpdateWizardTemplate).toBe(existing);
            expect(configTemplateServiceSpy.generateConfigUpdateTemplate).not.toHaveBeenCalled();
        });

    });
});

