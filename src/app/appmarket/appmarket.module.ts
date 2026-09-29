import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
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
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {SortService} from '../service/sort.service';
import {AppManagementModule} from './appmanagement/app-management.module';
import {SessionService} from '../service/session.service';
import {LanguageManagementModule} from './admin/languagemanagement/languagemanagement.module';
import {ModalGuestUserComponent} from './modals/modal-guest-user/modal-guest-user.component';
import {TooltipModule} from 'primeng/tooltip';
import {AppnavigatorComponent} from './bulkDeployment/appDeployment/appnavigator/appnavigator.component';
import {AvatarModule} from 'primeng/avatar';
import {StepsModule} from 'primeng/steps';
import {AppuploadComponent} from './bulkDeployment/appDeployment/appupload/appupload.component';
import {FileUploadModule} from 'primeng/fileupload';
import {AppsummaryComponent} from './bulkDeployment/appDeployment/appsummary/appsummary.component';
import {TableModule} from 'primeng/table';
import {DomainuploadComponent} from './bulkDeployment/domainDeployment/domainupload/domainupload.component';
import {BulkDomainListComponent} from './bulkDeployment/bulk-domain-list/bulk-domain-list.component';
import {BulkViewComponent} from './bulkDeployment/bulk-view/bulk-view.component';
import {BulkAppListComponent} from './bulkDeployment/bulk-app-list/bulk-app-list.component';
import {BulkListComponent} from './bulkDeployment/bulk-list/bulk-list.component';
import {TextareaModule} from 'primeng/textarea';
import {NgxPaginationModule} from 'ngx-pagination';
import {InputTextModule} from 'primeng/inputtext';
import {BulkSearchPipe} from './bulkDeployment/bulk-list/bulk-search.pipe';
import {CheckboxModule} from 'primeng/checkbox';
// import { InputSwitchModule } from 'primeng/inputswitch';
// import { OverlayPanelModule } from 'primeng/overlaypanel';
// import { SidebarModule } from 'primeng/sidebar';
import {ProgressBarModule} from 'primeng/progressbar';
import {WebhookDetailsComponent} from './admin/webhook/webhook-details/webhook-details.component';
import {WebhookListComponent} from './admin/webhook/webhook-list/webhook-list.component';
import {WebhookService} from '../service/webhook.service';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
import {MenuModule} from 'primeng/menu';
import {WebhookHistoryComponent} from './admin/webhook/webhook-history/webhook-history.component';
import {WebhookHistoryDetailsComponent} from './admin/webhook/webhook-history-details/webhook-history-details.component';
// import {DropdownModule} from 'primeng/dropdown';
import {DatePickerModule} from 'primeng/datepicker';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {SelectModule} from 'primeng/select';
import {BundleListComponent} from './bundle/bundle-list/bundle-list.component';
import {BundleDetailsComponent, DescriptionPipe} from './bundle/bundle-details/bundle-details.component';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {MultiSelect} from 'primeng/multiselect';


@NgModule({
    declarations: [
        AppMarketComponent,
        AppDetailsComponent,
        ModalGuestUserComponent,
        AppnavigatorComponent,
        AppuploadComponent,
        AppsummaryComponent,
        DomainuploadComponent,
        BulkDomainListComponent,
        BulkViewComponent,
        BulkAppListComponent,
        BulkListComponent,
        BulkSearchPipe,
        WebhookDetailsComponent,
        WebhookListComponent,
        WebhookHistoryComponent,
        WebhookHistoryDetailsComponent,
        BundleDetailsComponent,
        BundleListComponent
    ],
    exports: [
        AppMarketComponent,
        BulkSearchPipe
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        TranslatePipe,
        FormsModule,
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
        TranslateModule,
        TooltipModule,
        AvatarModule,
        StepsModule,
        FileUploadModule,
        TableModule,
        TextareaModule,
        NgxPaginationModule,
        InputTextModule,
        TooltipModule,
        CheckboxModule,
        ToggleSwitchModule,
        DrawerModule,
        ProgressBarModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        MenuModule,
        DatePickerModule,
        SelectModule,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
        DescriptionPipe,
        MultiSelect
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
        WebhookService,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppMarketModule {
}
