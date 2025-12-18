import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SsoFirstLoginComponent } from './sso-first-login.component';
import { AuthService } from '../../auth/auth.service';

describe('SsoFirstLoginComponent', () => {
    let fixture: ComponentFixture<SsoFirstLoginComponent>;
    let component: SsoFirstLoginComponent;

    const queryParams$ = new BehaviorSubject<Record<string, any>>({});

    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let translate: TranslateService;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
            'isLogged',
            'oidcLogout',
            'approveAupAndPn',
        ]);

        await TestBed.configureTestingModule({
            imports: [
                SsoFirstLoginComponent,
                RouterTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: queryParams$.asObservable() },
                },
                { provide: AuthService, useValue: authServiceSpy },
            ],
        })
            .overrideComponent(SsoFirstLoginComponent, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(SsoFirstLoginComponent);
        component = fixture.componentInstance;

        translate = TestBed.inject(TranslateService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('submit: should set translated error message on error', () => {
        (component as any).token = 'FAKE.JWT.TOKEN';
        (component as any).uuid = 'uuid-123';

        component.user = {
            email: 'a@b.com',
            firstname: 'Jan',
            lastname: 'Kowalski',
            username: 'jkowalski',
        } as any;

        authServiceSpy.approveAupAndPn.and.returnValue(throwError(() => ({ status: 401 })));
        spyOn(translate, 'instant').and.callFake((key: string) => `TR:${key}`);

        component.submit();

        expect(component.error).toBe('TR:LOGIN.LOGIN_FAILURE_MESSAGE');
    });

    it('checkConfirmations: should disable confirmation unless both checkboxes are true', () => {
        component.checkboxAUP = false;
        component.checkboxPN = false;
        component.checkConfirmations();
        expect(component.confirmationDisabled).toBeTrue();

        component.checkboxAUP = true;
        component.checkboxPN = false;
        component.checkConfirmations();
        expect(component.confirmationDisabled).toBeTrue();

        component.checkboxAUP = true;
        component.checkboxPN = true;
        component.checkConfirmations();
        expect(component.confirmationDisabled).toBeFalse();
    });
});
