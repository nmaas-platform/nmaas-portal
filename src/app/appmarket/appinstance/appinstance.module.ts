import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthModule} from '../../auth/auth.module';
import {SharedModule} from '../../shared/shared.module';
import {PipesModule} from '../../pipe/pipes.module';

import {AppInstanceComponent} from './appinstance/appinstance.component';
import {AppInstanceProgressModule} from './appinstanceprogress/appinstanceprogress.module';

import {AppsService} from '../../service/apps.service';
import {AppInstanceService} from '../../service/appinstance.service';
import {TagService} from '../../service/tag.service';
import {AppInstanceListComponent} from './appinstancelist/appinstancelist.component';
import {AppRestartModalComponent} from './modals/app-restart-modal';
import {AppAbortModalComponent} from './modals/app-abort-modal';
import {AppUpgradeModalComponent} from './modals/app-upgrade-modal';
import {TranslateModule} from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination';
import {AppConfig} from '../../../formio-config';
import {AccessMethodsModalComponent} from './modals/access-methods-modal/access-methods-modal.component';
import {SshShellComponent} from './ssh-shell/ssh-shell.component';
import {NgTerminalModule} from 'ng-terminal';
import {AppInstanceShellViewComponent} from './appinstance-shell-view/appinstance-shell-view.component';
import {AddMembersModalComponent} from './modals/add-members-modal/add-members-modal.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {SelectPodModalComponent} from './modals/select-pod-modal/select-pod-modal.component';
import {TooltipModule} from 'primeng/tooltip';
import {AppinstanceSearchPipe} from './appinstance-search.pipe';
import {InputTextModule} from 'primeng/inputtext';
import {AppdeploymentComponent} from '../bulkDeployment/appDeployment/appSelection/appdeployment.component';
import {DropdownModule} from 'primeng/dropdown';
import {TimelineModule} from 'primeng/timeline';
import {ButtonModule} from 'primeng/button';
import {AppLogAccessComponent} from './app-log-access/app-log-access.component';
import {FormioAppConfig, FormioModule} from '@formio/angular';

@NgModule({
  declarations: [
      AppInstanceComponent,
      AppInstanceListComponent,
      AppRestartModalComponent,
      AppAbortModalComponent,
      AppUpgradeModalComponent,
      AccessMethodsModalComponent,
      SshShellComponent,
      AppInstanceShellViewComponent,
      AddMembersModalComponent,
      SelectPodModalComponent,
      AppinstanceSearchPipe,
      SelectPodModalComponent,
      AppdeploymentComponent,
      AppLogAccessComponent
  ],
    imports: [
        FormioModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        AuthModule,
        AppInstanceProgressModule,
        PipesModule,
        NgxPaginationModule,
        TranslateModule.forChild(),
        NgTerminalModule,
        MultiSelectModule,
        TooltipModule,
        DropdownModule,
        TimelineModule,
        ButtonModule,
        InputTextModule,
    ],
  exports: [
    AppInstanceComponent,
    AppInstanceListComponent,
      AppinstanceSearchPipe
  ],
  providers: [
    AppsService,
    AppInstanceService,
    TagService,
    {provide: FormioAppConfig, useValue: AppConfig}
  ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppInstanceModule {}
