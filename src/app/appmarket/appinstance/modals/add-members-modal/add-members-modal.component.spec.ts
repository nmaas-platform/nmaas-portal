import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AddMembersModalComponent} from './add-members-modal.component';
import {AppInstanceService, UserService} from '../../../../service';
import {  TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../../../shared';
import {MultiSelectModule} from 'primeng/multiselect';
import {Role} from '../../../../model/userrole';
import {AppInstance, AppInstanceState, ConfigWizardTemplate, User} from '../../../../model';
import {ServiceAccessMethodType} from '../../../../model/service-access-method';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppInstanceExtended} from '../../../../model/app-instance-extended';
import {Tag} from '../../../../model/tag';
import {DomainApplicationStatePerDomain} from '../../../../model/domainapplicationstateperdomain';


class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('AddMembersModalComponent', () => {
    let component: AddMembersModalComponent;
    let fixture: ComponentFixture<AddMembersModalComponent>;

    const appInstanceServiceStub: Partial<AppInstanceService> = {};
    const appInstance: AppInstanceExtended = new AppInstanceExtended()

    beforeEach(waitForAsync(() => {

        const userServiceSpy = createSpyObj('UserService', ['getAll'])
        userServiceSpy.getAll.and.returnValue(of([]))

        TestBed.configureTestingModule({
            declarations: [AddMembersModalComponent],
            imports: [
                SharedModule,
                MultiSelectModule,
                FormsModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                })
            ],
            providers: [
                {provide: UserService, useValue: userServiceSpy},
                {provide: AppInstanceService, useValue: appInstanceServiceStub},
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddMembersModalComponent);
        component = fixture.componentInstance;
        component.appInstance = appInstance;
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
