import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AppVersionCreateWizardComponent} from './app-version-create-wizard.component';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {AppImagesService, AppsService, TagService} from '../../../service';
import {ConfigTemplateService} from '../../../service/configtemplate.service';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {StepsModule} from 'primeng/steps';
import {SharedModule} from '../../../shared';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('AppVersionCreateWizardComponent', () => {
    let component: AppVersionCreateWizardComponent;
    let fixture: ComponentFixture<AppVersionCreateWizardComponent>;
    let configTemplateServiceSpy: jasmine.SpyObj<ConfigTemplateService>;

    beforeEach(waitForAsync(() => {
        const tagServiceSpy = createSpyObj('TagService', ['getTags'])
        tagServiceSpy.getTags.and.returnValue(of([]))

        configTemplateServiceSpy = createSpyObj('ConfigTemplateService',
            ['getConfigTemplate', 'getConfigUpdateTemplate', 'generateConfigUpdateTemplate', 'isTemplateEmpty'])

        TestBed.configureTestingModule({
            declarations: [AppVersionCreateWizardComponent],
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
            schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
            providers: [
                {provide: TagService, useValue: tagServiceSpy},
                {provide: AppsService, useValue: {}},
                {provide: ConfigTemplateService, useValue: configTemplateServiceSpy},
                {provide: AppImagesService, useValue: {}}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppVersionCreateWizardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('handleConfigTemplate', () => {

        beforeEach(() => {
            component.applicationDTO = {
                application: {
                    appConfigurationSpec: { configUpdateEnabled: true },
                    configWizardTemplate: { template: { components: [] } },
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

        it('should replace an empty existing update template with the generated one', () => {
            component.applicationDTO.application.configUpdateWizardTemplate = {
                id: null,
                template: {
                    components: [
                        { type: 'container', input: true, key: 'configuration', hideLabel: true, components: [] }
                    ]
                }
            };
            const generated = { components: [{ type: 'container', input: true, key: 'accessCredentials', components: [] }] };
            configTemplateServiceSpy.isTemplateEmpty.and.returnValue(true);
            configTemplateServiceSpy.generateConfigUpdateTemplate.and.returnValue(generated);
            component.addConfigUpdate = true;

            component.handleConfigTemplate();

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

        it('should clear the update template when unchecked and the main wizard has no basic auth', () => {
            component.applicationDTO.application.configUpdateWizardTemplate = { id: null, template: { components: [] } };
            component.addConfigUpdate = false;

            component.handleConfigTemplate();

            expect(component.applicationDTO.application.configUpdateWizardTemplate).toBeUndefined();
        });

    });

});
