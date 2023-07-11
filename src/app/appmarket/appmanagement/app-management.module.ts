import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared';
import {AuthModule} from '../../auth/auth.module';
import {PipesModule} from '../../pipe/pipes.module';
import {TranslateModule} from '@ngx-translate/core';
import {AppConfigService, AppsService, TagService} from '../../service';
import {AppManagementListComponent} from './app-management-list/appmanagementlist.component';
import {StepsModule} from 'primeng/steps';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppCreateWizardComponent} from './app-create-wizard/app-create-wizard.component';
import {InternationalizationService} from '../../service/internationalization.service';
import {FormioAppConfig, FormioModule} from 'angular-formio';
import {ConfigTemplateService} from '../../service/configtemplate.service';
import {AppChangeStateModalComponent} from './app-change-state-modal/appchangestatemodal.component';
import {AppPreviewComponent} from './app-preview/apppreview.component';
import {AppVersionCreateWizardComponent} from './app-version-create-wizard/app-version-create-wizard.component';
import {AppAccessMethodEditComponent} from './app-access-method-edit-component/app-access-method-edit.component';
import {AppStorageVolumeEditComponent} from './app-storage-volume-edit-component/app-storage-volume-edit.component';
import {AppStaticGlobalDeployParametersEditComponent} from './app-static-global-deploy-parameters-edit/app-static-global-deploy-parameters-edit.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {FileUploadModule} from 'primeng/fileupload';
import {ChipsModule} from 'primeng/chips';
import { JsonEditComponent } from './json-edit/json-edit.component';
import {TabViewModule} from 'primeng/tabview';
import { AppChangeOwnerModalComponent } from './app-change-owner-modal/app-change-owner-modal.component';
import {TooltipModule} from 'primeng/tooltip';
import {DropdownModule} from 'primeng/dropdown';
import { AppAddJsonAppComponent } from './app-add-json-app/app-add-json-app.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { AppAddJsonVersionAppComponent } from './app-add-json-version-app/app-add-json-version-app.component';


export function getJsonTemplates(config: ConfigTemplateService) {
    return () => config.loadConfigTemplate();
}

export function formioAppConfigFactory(appConfig: AppConfigService) {
    return {
        appUrl: appConfig.getApiUrl(),
        apiUrl: appConfig.getApiUrl()
    }
}


@NgModule({
    declarations: [
        AppManagementListComponent,
        AppCreateWizardComponent,
        AppChangeStateModalComponent,
        AppPreviewComponent,
        AppVersionCreateWizardComponent,
        AppAccessMethodEditComponent,
        AppStorageVolumeEditComponent,
        AppStaticGlobalDeployParametersEditComponent,
        JsonEditComponent,
        AppChangeOwnerModalComponent,
        AppAddJsonAppComponent,
        AppAddJsonVersionAppComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedModule,
        AuthModule,
        PipesModule,
        TranslateModule.forChild(),
        FormioModule,
        RouterModule,
        StepsModule,
        MultiSelectModule,
        FileUploadModule,
        BrowserAnimationsModule,
        ChipsModule,
        ReactiveFormsModule,
        TabViewModule,
        TooltipModule,
        DropdownModule,
        InputTextareaModule
    ],
    exports: [],
    providers: [
        AppsService,
        TagService,
        InternationalizationService,
        ConfigTemplateService,
        {
            provide: APP_INITIALIZER,
            useFactory: getJsonTemplates,
            deps: [ConfigTemplateService],
            multi: true
        },
        {
            /*
            provide formio config for form builder to work properly (event without formio backend)
            ref:
            https://help.form.io/intro/guide/#appconfig
            https://github.com/formio/angular-formio/issues/456
             */
            provide: FormioAppConfig,
            useFactory: formioAppConfigFactory,
            deps: [AppConfigService]
        }
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppManagementModule {
}
