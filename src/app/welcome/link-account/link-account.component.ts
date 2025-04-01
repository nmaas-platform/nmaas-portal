import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../model';
import {ActivatedRoute, Router} from '@angular/router';
import jwtDecode from 'jwt-decode';
import {AuthService} from '../../auth/auth.service';


@Component({
    selector: 'app-link-account',
    templateUrl: './link-account.component.html',
    styleUrl: './link-account.component.css'
})
export class LinkAccountComponent implements OnInit, OnDestroy {
    public user: User;
    private token: string;
    public password: string;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private router: Router
    ) {
    }

    ngOnDestroy() {
        if (!this.authService.isLogged()) {
            this.authService.oidcLogout(this.token)
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.token = param['oidc_token'];
            const decoded: TokenPayload = jwtDecode<TokenPayload>(this.token);
            this.user = new User();
            this.user.username = decoded.sub;
            this.user.firstname = decoded.given_name;
            this.user.lastname = decoded.family_name;
            this.user.email = decoded.email;
        })

    }

    public submit(): void {
        this.authService.oidcLinkingLogin(
            this.token,
            this.user.email,
            this.password,
            this.user.username,
            this.user.firstname,
            this.user.lastname,
        ).subscribe(
            () => {
                this.router.navigate(['/']);
            }
        )
    }
}


interface TokenPayload {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
}
