import {RegistrationService} from '../auth/registration.service';
import {LoginComponent} from './login';
import {LogoutComponent} from './logout/logout.component';
import {PipesModule} from '../pipe/pipes.module';
import {SharedModule} from '../shared/shared.module';
import {RegistrationComponent} from './registration/registration.component';
import {ChangelogService} from '../service/changelog.service';
import {WelcomeComponent} from './welcome.component';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {AppMarketModule} from '../appmarket';
import {UserService} from '../service';
import {CompleteComponent} from './complete/complete.component';
import {ContentDisplayService} from '../service/content-display.service';
import {TermsAcceptanceComponent} from './terms-acceptance/terms-acceptance.component';
import {TranslateModule} from '@ngx-translate/core';
import {PasswordResetComponent} from './passwordreset/password-reset.component';
import {PasswordStrengthMeterComponent} from 'angular-password-strength-meter';
import {PolicySubpageComponent} from './policy-subpage/policy-subpage.component';
import {LinkAccountComponent} from './link-account/link-account.component';
import {InputTextModule} from 'primeng/inputtext';
import {SsoFirstLoginComponent} from './sso-first-login/sso-first-login.component';

@NgModule({
    declarations: [
        WelcomeComponent,
        LoginComponent,
        LogoutComponent,
        RegistrationComponent,
        ProfileComponent,
        CompleteComponent,
        TermsAcceptanceComponent,
        PasswordResetComponent,
        PolicySubpageComponent,
        LinkAccountComponent,
        SsoFirstLoginComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        SharedModule,
        PipesModule,
        AppMarketModule,
        PasswordStrengthMeterComponent,
        TranslateModule.forChild(),
        InputTextModule
    ],
    exports: [
        WelcomeComponent
    ],
    providers: [
        RegistrationService,
        UserService,
        ChangelogService,
        ContentDisplayService
    ]
})
export class WelcomeModule {
}
