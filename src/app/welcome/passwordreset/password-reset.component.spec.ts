import {PasswordResetComponent} from './password-reset.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UserService} from '../../service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalComponent} from '../../shared/modal';
import {RouterTestingModule} from '@angular/router/testing';
import {IPasswordStrengthMeterService, PasswordStrengthMeterModule} from 'angular-password-strength-meter';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';

describe('Password reset component', () => {
    let component: PasswordResetComponent;
    let fixture: ComponentFixture<PasswordResetComponent>;

    beforeEach(waitForAsync(() => {
        const userServiceSpy = createSpyObj('UserService', ['validateResetRequest'])
        userServiceSpy.validateResetRequest.and.returnValue(of({}))

        const passowrdSpy = createSpyObj('IPasswordStrengthMeterService', ['score'])
        passowrdSpy.score.and.returnValue("4")

        TestBed.configureTestingModule({
            declarations: [PasswordResetComponent, ModalComponent],
            imports: [
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
                PasswordStrengthMeterModule
            ],
            providers: [
                {provide: UserService, useValue: userServiceSpy},
                {provide: ReCaptchaV3Service, useValue: {}},
                {provide: IPasswordStrengthMeterService, useValue: passowrdSpy}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordResetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy()
    });
});
