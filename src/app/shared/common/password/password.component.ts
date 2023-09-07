import {Component, Injectable, ViewChild} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validator, Validators} from '@angular/forms';
import {UserService} from '../../../service';
import {Password} from '../../../model';
import {ModalComponent} from '../../modal';
import {PasswordStrengthMeterComponent} from 'angular-password-strength-meter';

@Injectable()
export class PasswordValidator implements Validator {

    static match(ac: AbstractControl) {
        return new PasswordValidator().validate(ac);
    }

    validate(ac: AbstractControl): { [key: string]: any } {
        const newPassword: string = ac.get('newPassword').value; // to get value in input tag
        const confirmPassword = ac.get('confirmPassword').value; // to get value in input tag

        if (newPassword !== confirmPassword) {
            ac.get('confirmPassword').setErrors({validateEqual: true});
            return {'validateEqual': true};
        } else {
            return null
        }
    }
}

@Component({
    selector: 'nmaas-password',
    templateUrl: './password.component.html',
    styleUrls: [],
})
export class PasswordComponent {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @ViewChild(PasswordStrengthMeterComponent, {static: true})
    passwordMeter: PasswordStrengthMeterComponent;

    public passwordForm: UntypedFormGroup;

    public errormsg: string;

    constructor(private fb: UntypedFormBuilder, private userService: UserService) {
        this.passwordForm = fb.group(
            {
                password: ['', Validators.required],
                newPassword: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required]
            },
            {
                validator: PasswordValidator.match
            }
        )
    }

    public submit(): void {
        if (this.passwordForm.valid) {
            this.userService.changePassword(
                new Password(
                    this.passwordForm.controls['password'].value,
                    this.passwordForm.controls['newPassword'].value
                )
            ).subscribe(
                () => this.hide(),
                (err) => {
                    this.errormsg = err.message ? err.message : err.statusMessage;
                }
            )
        }
    }

    public show(): void {
        this.modal.show();
    }

    public hide(): void {
        this.modal.hide();
        this.errormsg = undefined;
        this.passwordForm.reset();
    }
}
