import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-login-success',
    templateUrl: './login-success.component.html',
    styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {
    constructor(private route: ActivatedRoute,
                private authService: AuthService) {
    }


    ngOnInit(): void {
        // Pobieranie tokena z parametrów URL
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            const refreshToken = params['refresh_token'];
            if (token) {
                this.authService.storeToken(token);
            }
        });
    }
}
