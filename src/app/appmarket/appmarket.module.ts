import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AuthModule} from '../auth/auth.module';

import {AppMarketComponent} from './appmarket.component';
import {AppListModule} from './applist/applist.module';
import {AppDetailsComponent} from './appdetails';
import {AppInstanceModule} from './appinstance/appinstance.module';

import {SharedModule} from '../shared';

import {AppsService, DomainService, TagService, UserService} from '../service';

import {PipesModule} from '../pipe/pipes.module';
import {DomainsModule} from './domains/domains.module';
import {UsersModule} from './users/users.module';
import {ClustersModule} from './admin/clusters/clusters.module';
import {ClusterService} from '../service/cluster.service';
import {ConfigurationModule} from './admin/configuration/configuration.module';
import {MonitorModule} from './admin/monitor/monitor.module';
import {StorageServiceModule} from 'ngx-webstorage-service';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {SortService} from '../service/sort.service';
import {AppManagementModule} from './appmanagement/app-management.module';
import {SessionService} from '../service/session.service';
import {LanguageManagementModule} from './admin/languagemanagement/languagemanagement.module';
import { ModalGuestUserComponent } from './modals/modal-guest-user/modal-guest-user.component';
import {TooltipModule} from 'primeng/tooltip';
import { AppnavigatorComponent } from './bulkDeployment/appDeployment/appnavigator/appnavigator.component';
import {AvatarModule} from 'primeng/avatar';
import {StepsModule} from 'primeng/steps';
import { AppuploadComponent } from './bulkDeployment/appDeployment/appupload/appupload.component';
import {FileUploadModule} from 'primeng/fileupload';
import { AppsummaryComponent } from './bulkDeployment/appDeployment/appsummary/appsummary.component';
import {TableModule} from 'primeng/table';
import { DomainNavigatorComponent } from './bulkDeployment/domainDeployment/domainnavigator/domain-navigator.component';
import { DomainuploadComponent } from './bulkDeployment/domainDeployment/domainupload/domainupload.component';
import { DomainsummaryComponent } from './bulkDeployment/domainDeployment/domainsummary/domainsummary.component';
import { BulkDomainListComponent } from './bulkDeployment/bulk-domain-list/bulk-domain-list.component';
import { BulkViewComponent } from './bulkDeployment/bulk-view/bulk-view.component';
import { BulkAppListComponent } from './bulkDeployment/bulk-app-list/bulk-app-list.component';
import { BulkListComponent } from './bulkDeployment/bulk-list/bulk-list.component';

@NgModule({
  declarations: [
    AppMarketComponent,
    AppDetailsComponent,
    ModalGuestUserComponent,
    AppnavigatorComponent,
    AppuploadComponent,
    AppsummaryComponent,
    DomainNavigatorComponent,
    DomainuploadComponent,
    DomainsummaryComponent,
    BulkDomainListComponent,
    BulkViewComponent,
    BulkAppListComponent,
    BulkListComponent,
  ],
    imports: [
        FormsModule,
        StorageServiceModule,
        CommonModule,
        RouterModule,
        SharedModule,
        AppListModule,
        AppInstanceModule,
        AppManagementModule,
        LanguageManagementModule,
        DomainsModule,
        UsersModule,
        AuthModule,
        PipesModule,
        ClustersModule,
        MonitorModule,
        ConfigurationModule,
        BrowserModule,
        HttpClientModule,
        TranslateModule.forChild(),
        TooltipModule,
        AvatarModule,
        StepsModule,
        FileUploadModule,
        TableModule,
    ],
  exports: [
    AppMarketComponent,
  ],
  providers: [
    AppsService,
    DomainService,
    UserService,
    TagService,
    UserService,
    ClusterService,
    SortService,
    SessionService,
  ]

})
export class AppMarketModule {}
