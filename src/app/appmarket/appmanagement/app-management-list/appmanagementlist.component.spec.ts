import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppManagementListComponent } from './appmanagementlist.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppConfigService, AppsService} from '../../../service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../../../auth/auth.service';
import {AppChangeStateModalComponent} from '../app-change-state-modal/appchangestatemodal.component';
import {ModalComponent} from '../../../shared/modal';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MockAuthService} from '../../appmarket.component.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApplicationBase } from '../../../model/application-base';
import { ApplicationState } from '../../../model/application-state';
import { Rate } from '../../../model';
import { RemovalConfirmationModalComponent } from '../../domains/modals/removal-confirmation-modal/removal-confirmation-modal.component';

describe('AppManagementListComponent', () => {
  let component: AppManagementListComponent;
  let fixture: ComponentFixture<AppManagementListComponent>;

  let  confirmRemovalModal: ModalComponent = jasmine.createSpyObj('confirmRemovalModal', ['show'])

  const appBase: ApplicationBase = {
    id: 1,
    name: 'app',
    owner: 'admin',
    license: undefined,
    licenseUrl: undefined,
    wwwUrl: undefined,
    sourceUrl: undefined,
    issuesUrl: undefined,
    nmaasDocumentationUrl: undefined,
    descriptions: [],
    tags: [],
    versions: [
        {id: 1, version: '1.0.0', state: ApplicationState.ACTIVE, appVersionId: 1},
        {id: 2, version: '1.0.1', state: ApplicationState.ACTIVE, appVersionId: 2},
        {id: 3, version: '1.0.3', state: ApplicationState.NEW, appVersionId: 3}
    ],
    rate: new Rate(4, 4.5, new Map([[5, 1], [4, 1]]))
}

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
          AppManagementListComponent,
          AppChangeStateModalComponent,
          ModalComponent,
          RemovalConfirmationModalComponent
      ],
      providers: [
          AppsService,
          AppConfigService,
          {provide: AuthService, useClass: MockAuthService}
        ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be able to remove app', () => {
    component.openRemovalModal(appBase);
    expect(component.appToRemove).toEqual(appBase);
    expect(component.hasRunningInstances).toBeTruthy;
  })

  it('should be able to remove app', () => {
    appBase.versions.forEach(ver => {
      ver.state = ApplicationState.DELETED
    })
    component.openRemovalModal(appBase);
    expect(component.appToRemove).toEqual(appBase);
    expect(component.hasRunningInstances).toBeFalsy;
  })
});
