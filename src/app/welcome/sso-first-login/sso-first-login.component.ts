import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ModalInfoPolicyComponent} from '../../shared/modal/modal-info-policy/modal-info-policy.component';
import {User} from '../../model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import jwtDecode from 'jwt-decode';

@Component({
    selector: 'app-sso-first-login',
    imports: [
        FormsModule,
        TranslatePipe,
        ReactiveFormsModule
    ],
    templateUrl: './sso-first-login.component.html',
    styleUrl: './sso-first-login.component.css'
})
export class SsoFirstLoginComponent implements OnInit, OnDestroy {

    @ViewChild(ModalInfoPolicyComponent, {static: true})
    public readonly modalInfoPolicy: ModalInfoPolicyComponent;

    public user: User;
    private token: string;
    public password: string;
    public error: string;

    public checkboxAUP = false;
    public checkboxPN = false;

    private uuid: string;

    public confirmationDisabled = true;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly translate: TranslateService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.token = param['oidc-token'];
            const decoded: TokenPayload = jwtDecode<TokenPayload>(this.token);
            this.user = new User();
            this.user.username = decoded.preferred_username;
            this.user.firstname = decoded.given_name;
            this.user.lastname = decoded.family_name;
            this.user.email = decoded.email;
            this.uuid = decoded.sub;
        })

    }

    ngOnDestroy() {
        if (!this.authService.isLogged()) {
            this.authService.oidcLogout(this.token)
        }
    }

    public submit() {
        this.authService.approveAupAndPn(
            this.token,
            this.user.email,
            null,
            this.uuid,
            this.user.firstname,
            this.user.lastname,
            this.user.username,
            this.checkboxAUP,
            this.checkboxPN
        ).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err: any) => {
                this.error = this.translate.instant(this.getMessage(err));
            }
        })
    }

    public checkConfirmations() {
        this.confirmationDisabled = !(this.checkboxAUP && this.checkboxPN);
        console.log('checkboxAUP =', this.checkboxAUP);
        console.log('checkboxPN =', this.checkboxPN);
        console.log('confirmationDisabled =', this.confirmationDisabled);
    }

    private getMessage(err: any): string {
        switch (err['status']) {
            case 401:
                return 'LOGIN.LOGIN_FAILURE_MESSAGE';
            case 406:
                return 'LOGIN.APPLICATION_UNDER_MAINTENANCE_MESSAGE';
            case 409:
                return 'GENERIC_MESSAGE.UNAVAILABLE_MESSAGE';
            default:
                return 'GENERIC_MESSAGE.UNAVAILABLE_MESSAGE';
        }
    }
}

interface TokenPayload {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    preferred_username: string;
}
