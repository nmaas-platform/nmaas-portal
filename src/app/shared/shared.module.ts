import {DefaultLogo} from '../directive/defaultlogo.directive';
import {RolesDirective} from '../directive/roles.directive';
import {NgModule} from '@angular/core';
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
import {UsersListComponent} from './users/list/userslist.component';
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
import {PasswordStrengthMeterModule} from 'angular-password-strength-meter';
import {AboutComponent} from './about/about.component';
import {ChangelogComponent} from './changelog/changelog.component';
import {NotificationService} from '../service/notification.service';
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from 'ng-recaptcha';
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
import {FormioModule} from 'angular-formio';
import { PreferencesComponent } from './users/preferences/preferences.component';
import {TooltipModule} from 'primeng/tooltip';
import {DropdownModule} from 'primeng/dropdown';
import {SortableHeaderDirective} from '../service/sort-domain.directive';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        FormsModule,
        ServicesModule,
        RouterModule,
        ReactiveFormsModule,
        RecaptchaV3Module,
        PasswordStrengthMeterModule,
        TranslateModule.forChild(),
        NgxPaginationModule,
        FormioModule,
        TooltipModule,
        DropdownModule,
        CheckboxModule,
        InputTextModule,
    ],
    declarations: [
        RateComponent,
        FooterComponent,
        CommentsComponent,
        ScreenshotsComponent,
        ModalComponent,
        UserDetailsComponent,
        UsersListComponent,
        PasswordComponent,
        UserPrivilegesComponent,
        BaseComponent,
        DefaultLogo,
        NavbarComponent,
        DefaultLogo,
        RolesDirective,
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
        SortableHeaderDirective
    ],
    providers: [
        PasswordValidator,
        UserDataService,
        NotificationService,
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
        UsersListComponent,
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
        SshKeysComponent,
        ModalProvideSshKeyComponent,
        PreferencesComponent,
        SortableHeaderDirective
    ]
})
export class SharedModule {
}
