import {DefaultLogo} from '../directive/defaultlogo.directive';
import {RolesDirective} from '../directive/roles.directive';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';

import {CommentsComponent} from './comments/index';
import {FooterComponent} from './footer/index';
import {RateComponent} from './rate/index';
import {ScreenshotsComponent} from './screenshots/index';
import {ModalComponent} from './modal/index';
import {PipesModule} from '../pipe/pipes.module';
import {ServicesModule} from '../service/services.module';
import {UserDataService} from '../service/userdata.service';
import {PasswordComponent, PasswordValidator} from './common/password/password.component';
import {UserDetailsComponent} from './users/details/userdetails.component';
import {UsersListAdminComponent} from './users/list/adminuserslist.component';
import {UserPrivilegesComponent} from './users/privileges/userprivileges.component';
import {BaseComponent} from './common/basecomponent/base.component';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from './navbar/index';
import {SearchComponent} from './common/search/search.component';
import {TagFilterComponent} from './common/tagfilter/tagfilter.component';
import {DomainFilterComponent} from './common/domainfilter/domainfilter.component';
import {AppListComponent} from './applications/list/applist.component';
import {ApplicationsViewComponent} from './applications/applications.component';
import {AppElementComponent} from './applications/list/element/appelement.component';
import {ClusterDetailsComponent} from './admin/clusters/details/clusterdetails.component';
import {ModalInfoTermsComponent} from './modal/modal-info-terms/modal-info-terms.component';
import {ModalInfoPolicyComponent} from './modal/modal-info-policy/modal-info-policy.component';
import {TranslateModule} from '@ngx-translate/core';
import {SortableColumnComponent} from './sortable-column/sortable-column.component';
import {SortableTableDirective} from './sortable-column/sortable-table.directive';
import {AppInstallModalComponent} from './modal/appinstall';
import {RatingExtendedComponent} from './rating-extended/rating-extended.component';
import {PasswordStrengthMeterComponent} from 'angular-password-strength-meter';
import {AboutComponent} from './about/about.component';
import {ChangelogComponent} from './changelog/changelog.component';
import {NotificationService} from '../service/notification.service';
import {RECAPTCHA_V3_SITE_KEY, RecaptchaModule, RecaptchaV3Module} from 'ng-recaptcha';
import {SingleCommentComponent} from './comments/single-comment/single-comment.component';
import {TranslateStateModule} from './translate-state/translate-state.module';
import {MinLengthDirective} from '../directive/min-length.directive';
import {MaxLengthDirective} from '../directive/max-length.directive';
import {AppConfigService} from '../service';
import {ModalTestInstanceComponent} from './modal/modal-test-instance/modal-test-instance.component';
import {ModalNotificationSendComponent} from './modal/modal-notification-send/modal-notification-send.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {DomainRolesDirective} from '../directive/domain-roles.directive';
import {SshKeysComponent} from './users/ssh-keys/ssh-keys.component';
import {NewSshKeyComponent} from './users/new-ssh-key/new-ssh-key.component';
import {ModalProvideSshKeyComponent} from './modal/modal-provide-ssh-key/modal-provide-ssh-key.component';
import { ContactComponent } from './contact/contact.component';
import {FormioModule} from '@formio/angular';
import { PreferencesComponent } from './users/preferences/preferences.component';
import {TooltipModule} from 'primeng/tooltip';
import {DropdownModule} from 'primeng/dropdown';
import {SortableHeaderDirective} from '../service/sort-domain.directive';
import {InputTextModule} from 'primeng/inputtext';
import { DomainNamespaceAnnotationsComponent } from './domain-namespace-annotations/domain-namespace-annotations.component';
import { provideZxvbnServiceForPSM  } from 'angular-password-strength-meter/zxcvbn';
import { AccessTokensComponent } from './users/access-token/access-tokens.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import {TableModule} from 'primeng/table';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import {CheckboxModule} from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import {ChartModule} from 'primeng/chart';
import { RolesExcludedDirective } from '../directive/roles-exluded.directive';
import { FileUploadModule } from 'primeng/fileupload';
import { RecaptchaVisibilityService } from '../service/recaptcha-visibility.service';
import {CalendarModule} from 'primeng/calendar';
import { AddClusterComponent } from './admin/clusters/add-cluster/add-cluster.component';
import { StepsModule } from 'primeng/steps';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UserDomainListComponent } from './users/user-domain/user-domain-list.component';



@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        FormsModule,
        ServicesModule,
        RouterModule,
        ReactiveFormsModule,
        PasswordStrengthMeterComponent,
        TranslateModule.forChild(),
        NgxPaginationModule,
        FormioModule,
        TooltipModule,
        DropdownModule,
        InputTextModule,
        FormioModule,
        TableModule,
        CheckboxModule,
        InputGroupModule,
        InputGroupAddonModule,
        ButtonModule,
        RecaptchaV3Module,
        ButtonModule,
        ChartModule,
        FileUploadModule,
        TableModule,
        CalendarModule,
        StepsModule,
        InputTextareaModule,
        DialogModule,
        BrowserAnimationsModule
    ],
    declarations: [
        RateComponent,
        FooterComponent,
        CommentsComponent,
        ScreenshotsComponent,
        ModalComponent,
        UserDetailsComponent,
        UsersListAdminComponent,
        PasswordComponent,
        UserPrivilegesComponent,
        BaseComponent,
        DefaultLogo,
        NavbarComponent,
        DefaultLogo,
        RolesDirective,
        RolesExcludedDirective,
        MinLengthDirective,
        MaxLengthDirective,
        SearchComponent,
        TagFilterComponent,
        DomainFilterComponent,
        AppElementComponent,
        AppListComponent,
        AppInstallModalComponent,
        ApplicationsViewComponent,
        ClusterDetailsComponent,
        ModalInfoTermsComponent,
        ModalInfoPolicyComponent,
        SortableColumnComponent,
        SortableTableDirective,
        RatingExtendedComponent,
        AboutComponent,
        ChangelogComponent,
        SingleCommentComponent,
        ModalTestInstanceComponent,
        ModalNotificationSendComponent,
        DomainRolesDirective,
        PageNotFoundComponent,
        SshKeysComponent,
        NewSshKeyComponent,
        ModalProvideSshKeyComponent,
        ContactComponent,
        PreferencesComponent,
        SortableHeaderDirective,
        DomainNamespaceAnnotationsComponent,
        AccessTokensComponent,
        AdminDashboardComponent,
        AddClusterComponent,
        UserDomainListComponent
    ],
    providers: [
        PasswordValidator,
        UserDataService,
        NotificationService,
        RecaptchaVisibilityService,
        AppConfigService,
        DatePipe,
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useFactory: function (appConfigService: AppConfigService) {
                return appConfigService.getSiteKey();
            },
            deps: [AppConfigService]
        }
    ],
    exports: [
        RateComponent,
        FooterComponent,
        CommentsComponent,
        ScreenshotsComponent,
        ModalComponent,
        UserDetailsComponent,
        UsersListAdminComponent,
        PasswordComponent,
        UserPrivilegesComponent,
        NavbarComponent,
        UserPrivilegesComponent,
        AppInstallModalComponent,
        RolesDirective,
        MinLengthDirective,
        MaxLengthDirective,
        SearchComponent,
        TagFilterComponent,
        DomainFilterComponent,
        ApplicationsViewComponent,
        ClusterDetailsComponent,
        ModalInfoTermsComponent,
        ModalInfoPolicyComponent,
        SortableColumnComponent,
        SortableTableDirective,
        RatingExtendedComponent,
        AboutComponent,
        TranslateStateModule,
        ModalTestInstanceComponent,
        ModalNotificationSendComponent,
        DomainRolesDirective,
        RolesExcludedDirective,
        SshKeysComponent,
        ModalProvideSshKeyComponent,
        PreferencesComponent,
        SortableHeaderDirective,
        DomainNamespaceAnnotationsComponent,
        AccessTokensComponent
    ],
     schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]

})
export class SharedModule {
}
