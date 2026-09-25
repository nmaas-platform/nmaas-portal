import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleDetailsComponent } from './bundle-details.component';
import {ActivatedRoute, provideRouter} from '@angular/router';
import {MessageService} from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {BundleService} from '../../../service/bundle.service';
import { AppsService } from '../../../service';
import {ToastContainerComponent} from '../../../shared/toast-container/toast-container.component';
import {of} from 'rxjs';

describe('BundleDetailsComponent', () => {
  let component: BundleDetailsComponent;
  let fixture: ComponentFixture<BundleDetailsComponent>;


  const bundleServiceMock = jasmine.createSpyObj('BundleService', ['getById', 'create', 'update']);
  bundleServiceMock.getById.and.returnValue(of({ id: 1, name: 'Test bundle', apps: [] }));

  const appsServiceMock = jasmine.createSpyObj('AppsService', ['getAllApplicationBase']);
  appsServiceMock.getAllApplicationBase.and.returnValue(of([]));

  const toastMock = jasmine.createSpyObj('ToastContainerComponent', ['showSuccess', 'showError']);
  const mockModalSpy = jasmine.createSpyObj('ModalComponent', ['hide']);
  mockModalSpy.hide.and.returnValue(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BundleDetailsComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        TabsModule,

      ],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
        { provide: BundleService, useValue: bundleServiceMock },
        { provide: AppsService, useValue: appsServiceMock },
        { provide: ToastContainerComponent, useValue: toastMock },
      ],
    }).compileComponents();



    fixture = TestBed.createComponent(BundleDetailsComponent);
    component.modal = mockModalSpy;
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
