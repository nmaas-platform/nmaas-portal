import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {AppConfigService, ConfigurationService, UserService} from '../../service';
import {Configuration} from '../../model/configuration';
import {SSOConfig} from '../../model/sso';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ModalComponent} from '../../shared/modal';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'nmaas-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
    configuration: Configuration;
    ssoConfig: SSOConfig;
    resetPassword = false;
    resetPasswordForm: UntypedFormGroup;

    @ViewChild(ModalComponent, {static: true})
    public modal: ModalComponent;

    ssoLoading = false;
    ssoError = '';

    constructor(private router: Router,
                private auth: AuthService,
                private configService: ConfigurationService,
                private fb: UntypedFormBuilder,
                private userService: UserService,
                private translate: TranslateService,
                private appConfig: AppConfigService) {
        this.resetPasswordForm = fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit() {
        this.configService.getConfiguration().subscribe(config => {
            this.configuration = config;
        });
    }

    public login(): void {
        this.loading = true;
        this.error = '';
        this.auth.login(this.model.username, this.model.password).subscribe(
            () => {
                this.loading = false;
                this.translate.setDefaultLang(this.auth.getSelectedLanguage());
                this.translate.use(this.auth.getSelectedLanguage());
                this.router.navigate(['/']);
            }, err => {
                this.error = this.translate.instant(this.getMessage(err));
                this.loading = false;
            }
        );
    }

    // only for use in linking accounts
    public triggerOIDC() {
        if (this.configuration.maintenance) {
            window.location.href = this.appConfig.getOidcUrl();
        }
    }

    public sendResetNotification() {
        if (this.resetPasswordForm.valid) {
            this.userService.resetPasswordNotification(this.resetPasswordForm.controls['email'].value).subscribe(
                () => {
                    this.modal.show();
                }, () => {
                    this.modal.show();
                }
            );
        }
    }

    private getMessage(err: any): string {
        switch (err['status']) {
            case 401:
                return this.ssoLoading ? 'LOGIN.USER_DISABLED_MESSAGE' : 'LOGIN.LOGIN_FAILURE_MESSAGE';
            case 406:
                return 'LOGIN.APPLICATION_UNDER_MAINTENANCE_MESSAGE';
            case 409:
                return 'GENERIC_MESSAGE.UNAVAILABLE_MESSAGE';
            default:
                return 'GENERIC_MESSAGE.UNAVAILABLE_MESSAGE';
        }
    }
}
