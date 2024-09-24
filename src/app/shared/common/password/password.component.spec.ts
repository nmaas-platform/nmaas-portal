import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PasswordComponent} from './password.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UserService} from '../../../service';
import {SharedModule} from '../../shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import createSpyObj = jasmine.createSpyObj;
import { IPasswordStrengthMeterService } from 'angular-password-strength-meter';


describe('PasswordComponent', () => {
    let component: PasswordComponent;
    let fixture: ComponentFixture<PasswordComponent>;

     const passowrdSpy = createSpyObj('IPasswordStrengthMeterService', ['score'])
        passowrdSpy.score.and.returnValue("4")

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PasswordComponent],
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                SharedModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: UserService, useValue: {}},
                {provide: IPasswordStrengthMeterService, useValue: passowrdSpy}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
