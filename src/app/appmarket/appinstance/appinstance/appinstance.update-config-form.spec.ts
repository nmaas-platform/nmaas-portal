import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppInstanceComponent} from './appinstance.component';
import {FormsModule} from '@angular/forms';
import {JwtModule} from '@auth0/angular-jwt';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppConfigService, AppImagesService, AppInstanceService, AppsService, DomainService} from '../../../service';
import {AuthService} from '../../../auth/auth.service';
import {of} from 'rxjs';
import {FormioModule} from '@formio/angular';
import {AppInstanceProgressComponent} from '../appinstanceprogress';
import {PipesModule} from '../../../pipe/pipes.module';
import {RouterTestingModule} from '@angular/router/testing';
import {AppInstanceState, ConfigWizardTemplate, User} from '../../../model';
import {AppConfiguration} from '../../../model/app-configuration';
import {Role} from '../../../model/userrole';
import {ServiceAccessMethodType} from '../../../model/service-access-method';
import {AppDeploymentSpec} from '../../../model/app-deployment-spec';
import {AppConfigurationSpec} from '../../../model/app-configuration-spec';
import {ApplicationState} from '../../../model/application-state';
import {AppInstanceStateHistory} from '../../../model/app-instance-state-history';
import {CUSTOM_ELEMENTS_SCHEMA, Component, Directive, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {Domain} from '../../../model/domain';
import {ModalComponent} from '../../../shared/modal';
import {AppInstanceExtended} from '../../../model/app-instance-extended';
import {AppInstanceUpgradeInfo} from '../../../model/app-instance';
import {ActivatedRoute} from '@angular/router';
import {ShellClientService} from '../../../service/shell-client.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ApplicationBase} from '../../../model/application-base';
import {Application} from '../../../model/application';
import {ApplicationDTO} from '../../../model/application-dto';
import {DialogModule} from 'primeng/dialog';
import {ConfirmationService} from 'primeng/api';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {DomainApplicationStatePerDomain} from '../../../model/domainapplicationstateperdomain';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

@Component({
    selector: 'rate',
    template: '<p>Rate Mock</p>',
    standalone: false
})
class RateComponentMockComponent {
    @Input()
    private pathUrl: string;
    @Input()
    editable = false;
    @Input()
    short = false;
    @Input()
    showVotes = false;
}

@Component({
    selector: 'nmaas-appinstanceprogress',
    template: '<p>App Instance progress Mock</p>',
    standalone: false
})
class AppInstanceProgressMockComponent {
    @Input()
    stages: any;
    @Input()
    activeState: any;
    previousState: any;
    public AppInstanceState: any;

    constructor(translate: TranslateModule) {
    }

    public getTranslateTag(stateProgress): string {
        return ''
    }
}

@Directive({
    selector: '[roles]',
    standalone: false
})
class MockRolesDirective {
    @Input()
    public roles: string[] = []
}

@Component({
    selector: 'app-ssh-shell',
    template: '<p>SSH shell mock</p>',
    standalone: false
})
class SshShellMockComponent {
}

/**
 * Empirical verification of the #updateConfigForm modal rendering:
 * the real ModalComponent (p-dialog + ng-content projection) with the formio
 * config update wizard, opened on demand.
 */
describe('Component: AppInstance update config form modal', () => {
    let component: AppInstanceComponent;
    let fixture: ComponentFixture<AppInstanceComponent>;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const applicationBase: ApplicationBase = {
        id: 2,
        name: 'Oxidized',
        owner: 'admin',
        license: null,
        licenseUrl: null,
        wwwUrl: null,
        sourceUrl: null,
        issuesUrl: null,
        nmaasDocumentationUrl: null,
        descriptions: [],
        tags: [],
        versions: [{
            id: null,
            version: '0.12',
            state: ApplicationState.ACTIVE,
            appVersionId: 1,
        }],
        rate: null,
    };

    const application: Application = {
        id: 1,
        name: 'Oxidized',
        version: '1.0.0',
        configWizardTemplate: null,
        configUpdateWizardTemplate: null,
        appDeploymentSpec: new AppDeploymentSpec(),
        appConfigurationSpec: new AppConfigurationSpec(),
        state: ApplicationState.ACTIVE,
    }
    application.appDeploymentSpec.exposesWebUI = true;

    const dto: ApplicationDTO = {
        applicationBase, application
    }

    const domain: Domain = {
        id: 4,
        name: 'domain 1',
        codename: 'dom1',
        limitUsage: 0,
        active: true,
        deleted: false,
        domainDcnDetails: null,
        domainTechDetails: null,
        groups: [],
        clusters: [],
        applicationStatePerDomain: [
            {
                applicationBaseId: 2,
                applicationBaseName: 'Oxidized',
                enabled: true,
                pvStorageSizeLimit: 20
            }
        ],
        annotations: []
    } as unknown as Domain;

    const updateWizardTemplateJson = `{
        "title": "Update configuration",
        "components": [
            {
                "label": "Configuration",
                "hideLabel": true,
                "tableView": true,
                "type": "container",
                "input": true,
                "key": "configuration",
                "components": [
                    {
                        "type": "textfield",
                        "input": true,
                        "tableView": true,
                        "inputType": "text",
                        "inputMask": "",
                        "label": "First Name",
                        "key": "firstName",
                        "placeholder": "Enter your first name",
                        "prefix": "",
                        "suffix": "",
                        "multiple": false,
                        "defaultValue": "",
                        "protected": false,
                        "unique": false,
                        "persistent": true,
                        "validate": {"required": true, "minLength": 2, "maxLength": 10, "pattern": "", "custom": "", "customPrivate": false},
                        "conditional": {"show": "", "when": null, "eq": ""}
                    },
                    {
                        "type": "textfield",
                        "input": true,
                        "tableView": true,
                        "inputType": "text",
                        "inputMask": "",
                        "label": "Last Name",
                        "key": "lastName",
                        "placeholder": "Enter your last name",
                        "prefix": "",
                        "suffix": "",
                        "multiple": false,
                        "defaultValue": "",
                        "protected": false,
                        "unique": false,
                        "persistent": true,
                        "validate": {"required": false, "minLength": 2, "maxLength": 10, "pattern": "", "custom": "", "customPrivate": false},
                        "conditional": {"show": "", "when": null, "eq": ""}
                    }
                ]
            },
            {
                "label": "Additional Parameters",
                "hideLabel": true,
                "tableView": true,
                "type": "container",
                "input": true,
                "key": "additionalParameters",
                "components": [
                    {
                        "type": "email",
                        "input": true,
                        "tableView": true,
                        "label": "Email address for the initial admin user account",
                        "key": "healthchecks_dot_properties_dot_superuserEmail",
                        "placeholder": "Enter email address",
                        "defaultValue": "",
                        "persistent": true,
                        "validate": {"required": false}
                    }
                ]
            },
            {
                "label": "Mandatory Parameters",
                "hideLabel": true,
                "tableView": true,
                "type": "container",
                "input": true,
                "key": "mandatoryParameters",
                "components": [
                    {
                        "type": "textfield",
                        "input": true,
                        "tableView": true,
                        "label": "Registration open",
                        "key": "healthchecks_dot_properties_dot_registrationOpen",
                        "placeholder": "Enter yes or no",
                        "defaultValue": "",
                        "persistent": true,
                        "validate": {"required": false}
                    }
                ]
            }
        ]
    }`;

    const deployWizardTemplateJson = `{
        "components": [
            {
                "label": "Configuration",
                "hideLabel": true,
                "tableView": true,
                "type": "container",
                "input": true,
                "key": "configuration",
                "components": [
                    {"type": "textfield", "input": true, "key": "firstName", "label": "Deploy First Name"}
                ]
            }
        ]
    }`;

    const appInstance: AppInstanceExtended = {
        appId: 2,
        appBaseId: 2,
        domainId: 4,
        ownerUsername: '',
        appBaseName: 'Oxidized',
        appLicense: 'appLicense',
        appLicenseUrl: 'appLicenseUrl',
        appWwwUrl: 'appWwwUrl',
        appSourceUrl: 'appSourceUrl',
        appIssuesUrl: 'appIssuesUrl',
        appNmaasDocumentationUrl: 'appNmaasDocumentationUrl',
        applicationName: 'Oxidized',
        applicationVersion: '1.0.0',
        descriptiveDeploymentId: 'test-oxidized-48',
        chartVersion: '',

        autoUpgradesEnabled: true,
        upgradePossible: true,
        allowSshAccess: false,
        configUpdateEnabled: true,
        allowLogAccess: false,
        configFileRepositoryRequired: null,

        configWizardTemplate: {
            id: 1,
            template: JSON.parse(deployWizardTemplateJson)
        } as ConfigWizardTemplate,
        configUpdateWizardTemplate: {
            id: 2,
            template: JSON.parse(updateWizardTemplateJson)
        } as ConfigWizardTemplate,
        state: AppInstanceState.RUNNING,
        tags: null,
        applicationStatePerDomain: {applicationBaseId: 2, applicationBaseName: 'Oxidized', enabled: true, pvStorageSizeLimit: 20} as unknown as DomainApplicationStatePerDomain,

        applicationId: 2,
        applicationBaseId: 2,

        configuration: '{"firstName":"John","lastName":"Doe"}',
        createdAt: new Date(),
        domainName: 'Test Domain',
        id: 1,
        internalId: 'eccbaf70-7fdd-401a-bb3e-b8659bcfbdff',
        name: 'oxi-virt-1',
        owner: {
            id: 1, username: 'admin', enabled: true,
            firstname: null, lastname: null,
            email: 'admin@admi.eu', selectedLanguage: 'en',
            privacyPolicyAccepted: true, ssoUser: false,
            termsOfUseAccepted: false, roles: [{domainId: 1, role: Role.ROLE_SYSTEM_ADMIN}]
        } as User,

        serviceAccessMethods: [
            {type: ServiceAccessMethodType.DEFAULT, name: 'Default link', protocol: 'Web', url: 'http://oxi-virt-1.test.nmaas.geant.org'},
        ],
        userFriendlyState: 'Application instance is running',
        appConfigRepositoryAccessDetails: {
            cloneUrl: 'http://clone.me'
        },
        members: [],
        upgradeInfo: {
            applicationId: 3,
            applicationVersion: '1.2.0',
            helmChartVersion: '1.0.1',
        } as AppInstanceUpgradeInfo
    };

    const appInstanceHistory: AppInstanceStateHistory[] = [];

    // hoisted so individual specs can override chosen endpoints
    // (e.g. getConfiguration returning data different from the page-load snapshot)
    let appInstanceServiceStub: Partial<AppInstanceService>;

    beforeEach(async () => {
        const mockAppConfigService = jasmine.createSpyObj('AppConfigService', ['getApiUrl', 'getHttpTimeout']);
        mockAppConfigService.getApiUrl.and.returnValue('http://localhost/api');
        mockAppConfigService.getHttpTimeout.and.returnValue(10000);

        const mockShellClientService = jasmine.createSpyObj('ShellClientService', ['getPossiblePods']);
        mockShellClientService.getPossiblePods.and.returnValue(of([]))

        const appsServiceStub: Partial<AppsService> = {};

        appInstanceServiceStub = {
            getAppInstance: () => of(appInstance),
            getAppInstanceHistory: () => of(appInstanceHistory),
            getProgressStages: () => [],
            getDeploymentParameters: () => of(new Map<string, string>()),
            getConfiguration: () => of(JSON.parse(appInstance.configuration)),
            getAppInstanceState: () => of({
                appInstanceId: 1,
                state: AppInstanceState.RUNNING,
                previousState: AppInstanceState.RUNNING,
                details: 'details',
                userFriendlyDetails: 'User friendly details',
                userFriendlyState: 'User friendly state'
            })
        };
        const domainServiceStub: Partial<DomainService> = {};
        const appImagesServiceStub: Partial<AppImagesService> = {
            getAppLogoUrl: () => ''
        };

        const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsername', 'hasRole', 'hasDomainRole']);
        authServiceSpy.getUsername.and.returnValue('username');
        authServiceSpy.hasRole.and.returnValue(true);
        authServiceSpy.hasDomainRole.and.returnValue(true);

        await TestBed.configureTestingModule({
            declarations: [
                AppInstanceComponent,
                AppInstanceProgressMockComponent,
                RateComponentMockComponent,
                MockRolesDirective,
                SshShellMockComponent,
                ModalComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [FormsModule,
                PipesModule,
                FormioModule,
                DialogModule,
                RouterTestingModule,
                JwtModule.forRoot({}),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                })],
            providers: [
                ConfirmationService,
                {provide: AppConfigService, useValue: mockAppConfigService},
                {provide: AppsService, useValue: appsServiceStub},
                {provide: AuthService, useValue: authServiceSpy},
                {provide: AppInstanceService, useValue: appInstanceServiceStub},
                {provide: DomainService, useValue: domainServiceStub},
                {provide: AppImagesService, useValue: appImagesServiceStub},
                {provide: ShellClientService, useValue: mockShellClientService},
                {provide: ActivatedRoute, useValue: {params: of({id: 1})}},
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppInstanceComponent);
        component = fixture.componentInstance;
        component.appInstanceProgress =
            TestBed.createComponent(AppInstanceProgressMockComponent).componentInstance as AppInstanceProgressComponent;

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should expose the update config wizard template after init', () => {
        expect(component.configurationUpdateTemplate).withContext('configurationUpdateTemplate must be set in ngOnInit').toBeDefined();
        expect(component.configurationUpdateTemplate.components[0].components.length).toBe(2);
    });

    it('should render the update wizard form fields inside the opened #updateConfigForm modal', async () => {
        // formio is initialized detached from the document while the modal is closed;
        // opening the modal attaches the projected content to the p-dialog appended to body
        component.getConfigurationFormModal();
        fixture.detectChanges();
        // give the dialog and form.io time to finish their async rendering
        await new Promise(resolve => setTimeout(resolve, 1000));
        fixture.detectChanges();

        const dialogContent = document.querySelector('.p-dialog-content');
        expect(dialogContent).withContext('the p-dialog content must be attached to the document body').not.toBeNull();

        const dialogText = dialogContent.textContent;
        expect(dialogText).withContext('update wizard field must be visible in the modal').toContain('First Name');
        expect(dialogText).toContain('Last Name');

        const firstNameInput = dialogContent.querySelector('input[name*="firstName"]') as HTMLInputElement;
        expect(firstNameInput).not.toBeNull();
        expect(firstNameInput.value).withContext('current configuration must prefill the form').toBe('John');
    });

    it('should submit the form via submitConfigurationUpdateForm', async () => {
        component.getConfigurationFormModal();
        fixture.detectChanges();
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(component.updateConfigFormio).withContext('#updateConfigFormio ViewChild must resolve').toBeTruthy();

        const submittedData: any[] = [];
        component.changeConfigUpdate = (data) => submittedData.push(data);
        component.submitConfigurationUpdateForm();
        await new Promise(resolve => setTimeout(resolve, 200));

        expect(submittedData.length).withContext('formio submit event must trigger changeConfigUpdate').toBe(1);
        expect(submittedData[0].configuration.firstName).toBe('John');
    });

    it('should prefill the update form with the current configuration fetched when the modal opens', async () => {
        // the server returns newer data than the page-load snapshot used in ngOnInit
        appInstanceServiceStub.getConfiguration = () => of({firstName: 'Jane', lastName: 'Doe'});

        component.getConfigurationFormModal();
        fixture.detectChanges();
        await new Promise(resolve => setTimeout(resolve, 1000));
        fixture.detectChanges();

        const firstNameInput = document.querySelector('.p-dialog-content input[name*="firstName"]') as HTMLInputElement;
        expect(firstNameInput).not.toBeNull();
        expect(firstNameInput.value).withContext('fresh configuration from the server must prefill the form').toBe('Jane');
    });

    it('should prefill escaped deployment parameters into matching wizard fields', async () => {
        // instance without stored configuration content - all current values come from deployment parameters,
        // keyed with dots by the backend ("healthchecks.properties.superuserEmail")
        appInstanceServiceStub.getConfiguration = () => of('');
        appInstanceServiceStub.getDeploymentParameters = () => of({
            'healthchecks.properties.superuserEmail': 'test@test.net'
        } as any);

        component.getConfigurationFormModal();
        fixture.detectChanges();
        await new Promise(resolve => setTimeout(resolve, 1000));
        fixture.detectChanges();

        const emailInput = document.querySelector('.p-dialog-content input[name*="superuserEmail"]') as HTMLInputElement;
        expect(emailInput).withContext('escaped parameter field must be rendered').not.toBeNull();
        expect(emailInput.value).withContext('dotted backend parameter key must match the escaped wizard field key').toBe('test@test.net');
    });

    it('should prefill escaped deployment parameters into mandatory parameter fields', async () => {
        // the backend returns a single flat map of deployment parameters,
        // mandatory container fields must be filled from it as well
        appInstanceServiceStub.getConfiguration = () => of('');
        appInstanceServiceStub.getDeploymentParameters = () => of({
            'healthchecks.properties.registrationOpen': 'yes'
        } as any);

        component.getConfigurationFormModal();
        fixture.detectChanges();
        await new Promise(resolve => setTimeout(resolve, 1000));
        fixture.detectChanges();

        const registrationInput = document.querySelector('.p-dialog-content input[name*="registrationOpen"]') as HTMLInputElement;
        expect(registrationInput).withContext('mandatory parameter field must be rendered').not.toBeNull();
        expect(registrationInput.value).withContext('dotted backend parameter key must prefill the mandatory field').toBe('yes');
    });

    it('should not leak deployment parameters foreign to the update wizard containers into the submission', async () => {
        appInstanceServiceStub.getConfiguration = () => of('');
        appInstanceServiceStub.getDeploymentParameters = () => of({
            'healthchecks.properties.superuserEmail': 'test@test.net',
            'healthchecks.properties.registrationOpen': 'yes',
            'unrelated.parameter': 'leak'
        } as any);

        const submittedData: any[] = [];
        component.changeConfigUpdate = (data) => submittedData.push(data);

        component.getConfigurationFormModal();
        fixture.detectChanges();
        await new Promise(resolve => setTimeout(resolve, 1000));

        component.submitConfigurationUpdateForm();
        await new Promise(resolve => setTimeout(resolve, 200));

        expect(submittedData.length).withContext('formio submit event must trigger changeConfigUpdate').toBe(1);
        expect(submittedData[0].additionalParameters)
            .withContext('additional parameters must contain only fields of the additionalParameters container')
            .toEqual({'healthchecks_dot_properties_dot_superuserEmail': 'test@test.net'});
        expect(submittedData[0].mandatoryParameters)
            .withContext('mandatory parameters must contain only fields of the mandatoryParameters container')
            .toEqual({'healthchecks_dot_properties_dot_registrationOpen': 'yes'});
    });

    it('should not prefill mandatory parameters when the update wizard has no mandatory parameters container', async () => {
        appInstanceServiceStub.getConfiguration = () => of('');
        appInstanceServiceStub.getDeploymentParameters = () => of({
            'healthchecks.properties.registrationOpen': 'yes'
        } as any);

        component.configurationUpdateTemplate = {
            ...component.configurationUpdateTemplate,
            components: component.configurationUpdateTemplate.components
                .filter(formComponent => formComponent.key !== 'mandatoryParameters')
        };

        component.getConfigurationFormModal();
        fixture.detectChanges();
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(component.submission.data.mandatoryParameters)
            .withContext('missing container must not be prefilled and must not reach the request')
            .toBeUndefined();
        expect(component.submission.data.additionalParameters)
            .withContext('parameters not matching container fields must not be prefilled')
            .toEqual({});
    });

    it('should not prefill parameters for containers missing from the configuration preview template', () => {
        appInstanceServiceStub.getDeploymentParameters = () => of({
            'healthchecks.properties.superuserEmail': 'test@test.net'
        } as any);

        component.openShowConfigModal();

        expect(component.submission.data.additionalParameters)
            .withContext('deploy wizard without additionalParameters container must not be prefilled')
            .toBeUndefined();
        expect(component.submission.data.mandatoryParameters)
            .withContext('deploy wizard without mandatoryParameters container must not be prefilled')
            .toBeUndefined();
    });

    it('should include additional and mandatory parameters in the configuration update request', () => {
        const savedConfigurations: AppConfiguration[] = [];
        appInstanceServiceStub.updateConfiguration = (appInstanceId: number, configuration: AppConfiguration) => {
            savedConfigurations.push(configuration);
            return of(null);
        };

        component.changeConfigUpdate({
            configuration: {firstName: 'Jane'},
            accessCredentials: {user: 'user'},
            additionalParameters: {param: 'value'},
            mandatoryParameters: {mandatory: 'value'}
        });

        expect(savedConfigurations.length).withContext('updateConfiguration must be called once').toBe(1);
        expect(savedConfigurations[0].jsonInput).toEqual({firstName: 'Jane'});
        expect(savedConfigurations[0].accessCredentials).toEqual({user: 'user'});
        expect(savedConfigurations[0].additionalParameters).toEqual({param: 'value'});
        expect(savedConfigurations[0].mandatoryParameters).toEqual({mandatory: 'value'});
    });

    it('should show the FORM update button in the row menu for admins when the update wizard template exists', () => {
        component.rowMenu = {toggle: () => {}} as any;

        component.openRowMenu({} as any, appInstance);

        const formButton = component.rowMenuItems.find(item => item.label === 'APP_INSTANCE.UPDATE_CONFIG_FORM_BUTTON');
        expect(formButton).withContext('FORM update button must be available').toBeDefined();
        formButton.command({} as any);
        expect(component.updateConfigFormModal.visible).toBeTrue();
    });
});
