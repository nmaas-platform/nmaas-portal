import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PasswordComponent} from './password.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UserService} from '../../../service';
import {SharedModule} from '../../shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {PasswordModule} from 'primeng/password';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}


describe('PasswordComponent', () => {
    let component: PasswordComponent;
    let fixture: ComponentFixture<PasswordComponent>;


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PasswordComponent],
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                SharedModule,
                PasswordModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: UserService, useValue: {}},
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
