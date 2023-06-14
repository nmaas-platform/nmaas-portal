import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DomainsListComponent} from './domainslist.component';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import createSpyObj = jasmine.createSpyObj;
import {AuthService} from '../../../auth/auth.service';
import {DomainService} from '../../../service';
import {of} from 'rxjs';
import {SearchDomainPipe} from '../domain-search.pipe';
import {PaginatePipe, PaginationService} from 'ngx-pagination';

describe('DomainslistComponent', () => {
    let component: DomainsListComponent;
    let fixture: ComponentFixture<DomainsListComponent>;

    beforeEach(waitForAsync(() => {
        const authServiceSpy = createSpyObj('AuthService', ['hasRole']);
        authServiceSpy.hasRole.and.returnValue(true)

        const domainServiceSpy = createSpyObj('DomainService', ['getGlobalDomainId', 'getAll'])
        domainServiceSpy.getAll.and.returnValue(of([]))
        domainServiceSpy.getGlobalDomainId.and.returnValue(1)

        TestBed.configureTestingModule({
            declarations: [DomainsListComponent, SearchDomainPipe, PaginatePipe],
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: AuthService, useValue: authServiceSpy},
                {provide: DomainService, useValue: domainServiceSpy},
                PaginationService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DomainsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
