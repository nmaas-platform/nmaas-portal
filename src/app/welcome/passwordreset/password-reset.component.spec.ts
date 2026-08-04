import {PasswordResetComponent} from './password-reset.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UserService} from '../../service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalComponent} from '../../shared/modal';
import {RouterTestingModule} from '@angular/router/testing';
import {ReCaptchaV3Service} from '../../service/recaptcha-v3.service';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('Password reset component', () => {
    let component: PasswordResetComponent;
    let fixture: ComponentFixture<PasswordResetComponent>;

    beforeEach(waitForAsync(() => {
        const userServiceSpy = createSpyObj('UserService', ['validateResetRequest'])
        userServiceSpy.validateResetRequest.and.returnValue(of({}))


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
                })
            ],
            providers: [
                {provide: UserService, useValue: userServiceSpy},
                {provide: ReCaptchaV3Service, useValue: {}}
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
