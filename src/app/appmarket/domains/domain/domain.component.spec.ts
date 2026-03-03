import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DomainComponent} from './domain.component';
import {RouterTestingModule} from '@angular/router/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppsService, DomainService, UserService} from '../../../service';
import {AuthService} from '../../../auth/auth.service';
import {SharedModule} from '../../../shared';
import {FormsModule} from '@angular/forms';
import createSpyObj = jasmine.createSpyObj;
import {ToastContainerComponent} from '../../../shared/toast-container/toast-container.component';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('DomainComponent', () => {
    let component: DomainComponent;
    let fixture: ComponentFixture<DomainComponent>;
    let mockToast: jasmine.SpyObj<ToastContainerComponent>;

    beforeEach(waitForAsync(() => {
        const authServiceSpy = createSpyObj('AuthService', ['hasRole']);
        authServiceSpy.hasRole.and.returnValue(true)

        const domainServiceSpy = createSpyObj('DomainService', ['getGlobalDomainId'])
        domainServiceSpy.getGlobalDomainId.and.returnValue(1)
        mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);

        TestBed.configureTestingModule({
            declarations: [DomainComponent],
            imports: [
                SharedModule,
                FormsModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: DomainService, useValue: domainServiceSpy},
                {provide: UserService, useValue: {}},
                {provide: AuthService, useValue: authServiceSpy},
                {provide: AppsService, useValue: {}},
                { provide: ToastContainerComponent, useValue: mockToast }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DomainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
