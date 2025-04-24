import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-login-success',
    templateUrl: './login-success.component.html',
    styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {
    constructor(private readonly router: Router,
                private readonly route: ActivatedRoute,
                private readonly authService: AuthService) {
    }


    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            const refreshToken = params['refresh-token'];
            const oidcToken = params['oidc-token'];
            if (token) {
                this.authService.storeToken(token);
            }
            if (oidcToken) {
                this.authService.storeOidcToken(oidcToken);
            }
            if (refreshToken) {
                this.authService.storeRefreshToken(refreshToken);
            }
            this.authService.loadUser();
            this.router.navigate(['/'])
        })

    }
}
