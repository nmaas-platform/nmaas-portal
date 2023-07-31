import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../model';
import {PasswordReset} from '../../model/passwordreset';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../../shared';
import {PasswordStrengthMeterComponent} from 'angular-password-strength-meter';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
    selector: 'app-passwordreset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit {

    public user: User;

    public passwordReset: PasswordReset = new PasswordReset();

    public token: string;

    @ViewChild(PasswordStrengthMeterComponent)
    passwordMeter: PasswordStrengthMeterComponent;

    public form: UntypedFormGroup;

    public errorMessage: string;

    public showLoading = false;

    constructor(private fb: UntypedFormBuilder,
                private userService: UserService,
                private router: Router,
                private route: ActivatedRoute,
                private recaptchaV3Service: ReCaptchaV3Service) {
        this.form = fb.group(
            {
                newPassword: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required]
            },
            {
                validator: PasswordValidator.match
            });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.token = params['token'];
            this.userService.validateResetRequest(params['token'])
                .subscribe(result => this.user = result, error1 => this.errorMessage = error1.message);
        });
    }

    public resetPassword() {
        if (this.form.valid) {
            this.recaptchaV3Service.execute('password_reset').pipe(
                catchError(_ => of('')), // in case of captcha error return empty token
            ).subscribe((captchaToken) => {
                this.showLoading = true;
                this.passwordReset.password = this.form.controls['newPassword'].value;
                this.passwordReset.token = this.token;
                this.userService.resetPassword(this.passwordReset, captchaToken).subscribe(
                    () => {
                        this.showLoading = false;
                        this.router.navigate(['/'])
                    },
                    err => this.errorMessage = err.message
                );
            });
        }
    }

    public goBack() {
        this.router.navigate(['/']);
    }

}
