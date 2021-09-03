import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppChangeOwnerModalComponent} from './app-change-owner-modal.component';
import {FormsModule} from '@angular/forms';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import createSpyObj = jasmine.createSpyObj;
import {AppsService, UserService} from '../../../service';
import {of} from 'rxjs';

describe('AppChangeOwnerModalComponent', () => {
    let component: AppChangeOwnerModalComponent;
    let fixture: ComponentFixture<AppChangeOwnerModalComponent>;

    const appsServiceSpy = createSpyObj<AppsService>('AppsServiceSpy', ['updateApplicationBase']);
    appsServiceSpy.updateApplicationBase.and.returnValue(of('1'))

    const userServiceSpy = createSpyObj<UserService>('UserServiceSpy', ['getAll'])
    userServiceSpy.getAll.and.returnValue(of([]));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppChangeOwnerModalComponent],
            imports: [
                FormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                })
            ],
            providers: [
                {provide: AppsService, useValue: appsServiceSpy},
                {provide: UserService, useValue: userServiceSpy},
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppChangeOwnerModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
