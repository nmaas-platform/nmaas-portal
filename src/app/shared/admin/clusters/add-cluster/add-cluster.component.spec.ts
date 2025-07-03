import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddClusterComponent } from './add-cluster.component';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { DomainService } from '../../../../service/domain.service';
import { UserDataService } from '../../../../service/userdata.service';
import { AuthService } from '../../../../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, BehaviorSubject } from 'rxjs';
import { ClusterManager } from '../../../../model/cluster-manager';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {ToastContainerComponent} from '../../../toast-container/toast-container.component';

describe('AddClusterComponent', () => {
  let component: AddClusterComponent;
  let fixture: ComponentFixture<AddClusterComponent>;
  let clusterService: jasmine.SpyObj<ClusterManagerService>;
  let domainService: jasmine.SpyObj<DomainService>;
  let userDataService: jasmine.SpyObj<UserDataService>;
  let authService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToast: jasmine.SpyObj<ToastContainerComponent>;

  beforeEach(waitForAsync(() => {
    const clusterServiceSpy = jasmine.createSpyObj('ClusterManagerService', ['sendCluster', 'readClusterFile']);
    const domainServiceSpy = jasmine.createSpyObj('DomainService', ['getAllBase', 'getMyDomains']);
    domainServiceSpy.getAllBase.and.returnValue(of([]));
    domainServiceSpy.getMyDomains.and.returnValue(of([]));
    const userDataServiceSpy = jasmine.createSpyObj('UserDataService', [], {
      selectedDomainId: new BehaviorSubject<number>(1).asObservable()
    });
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getGlobalRole']);
    authServiceSpy.getGlobalRole.and.returnValue(['ROLE_SYSTEM_ADMIN']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);

    TestBed.configureTestingModule({
      declarations: [AddClusterComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      providers: [
        { provide: ClusterManagerService, useValue: clusterServiceSpy },
        { provide: DomainService, useValue: domainServiceSpy },
        { provide: UserDataService, useValue: userDataServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastContainerComponent, useValue: mockToast },
        DatePipe
      ],
       schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    clusterService = TestBed.inject(ClusterManagerService) as jasmine.SpyObj<ClusterManagerService>;
    domainService = TestBed.inject(DomainService) as jasmine.SpyObj<DomainService>;
    userDataService = TestBed.inject(UserDataService) as jasmine.SpyObj<UserDataService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize domains for system admin', () => {
  //   const mockDomains: any[] = [{ id: 1, name: 'Domain1' }, { id: 2, name: 'Domain2' }];
  //   domainService.getAllBase.and.returnValue(of(mockDomains));
  //   authService.getGlobalRole.and.returnValue(['ROLE_SYSTEM_ADMIN']);

  //   component.ngOnInit();

  //   expect(domainService.getAllBase).toHaveBeenCalled();
  //   expect(component.domains).toEqual(mockDomains);
  // });

  it('should send cluster with file', () => {
    const mockFile = new File(['test content'], 'test.yaml', { type: 'application/x-yaml' });
    const mockCluster = new ClusterManager();
    clusterService.sendCluster.and.returnValue(of(mockCluster));

    component.kubernetesFile = 'test content';
    component.cluster = mockCluster;
    component.submit();

    expect(clusterService.sendCluster).toHaveBeenCalledWith(jasmine.any(File), mockCluster, true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/manage/clusters']);
  });

  // it('should handle errors when sending cluster', () => {
  //   const mockFile = new File(['test content'], 'test.yaml', { type: 'application/x-yaml' });
  //   clusterService.sendCluster.and.returnValue(of(new ClusterManager()));

  //   component.kubernetesFile = 'test content';
  //   component.cluster = new ClusterManager();
  //   component.submit();

  //   expect(component.error).toBe('Failed to send cluster');
  // });

  it('should handle domain selection', () => {
    const mockDomain = 'test-domain';
    component.onDomainSelection(mockDomain);

    expect(component.cluster.domainNames).toEqual([mockDomain]);
  });
});
