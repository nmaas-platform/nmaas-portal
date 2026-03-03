import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UsersListAdminComponent} from './adminuserslist.component';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DomainService, UserService} from '../../../service';
import {UserDataService} from '../../../service/userdata.service';
import {AuthService} from '../../../auth/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JwtModule} from '@auth0/angular-jwt';
import {NgxPaginationModule} from 'ngx-pagination';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('UserslistComponent', () => {
    let component: UsersListAdminComponent;
    let fixture: ComponentFixture<UsersListAdminComponent>;

    beforeEach(waitForAsync(() => {
        const authServiceSpy = createSpyObj('AuthService', ['hasRole', 'hasDomainRole']);
        authServiceSpy.hasRole.and.returnValue(true)
        authServiceSpy.hasDomainRole.and.returnValue(true)

        const domainServiceSpy = createSpyObj('DomainService', ['getGlobalDomainId', 'getAllBase', 'getMyDomains'])
        domainServiceSpy.getGlobalDomainId.and.returnValue(1)
        domainServiceSpy.getAllBase.and.returnValue(of([]))
        domainServiceSpy.getMyDomains.and.returnValue(of([]))

        TestBed.configureTestingModule({
            declarations: [UsersListAdminComponent],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    },
                }),
                JwtModule.forRoot({
                    config: {
                        tokenGetter: () => {
                            return '';
                        }
                    }
                }),
                FormsModule,
                NgxPaginationModule,
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule
            ],
            providers: [
                {provide: DomainService, useValue: domainServiceSpy},
                {provide: AuthService, useValue: authServiceSpy},
                {
                    provide: UserDataService, useValue: {
                        selectedDomainId: of(1)
                    }
                },
                {provide: UserService, useValue: {}},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UsersListAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
