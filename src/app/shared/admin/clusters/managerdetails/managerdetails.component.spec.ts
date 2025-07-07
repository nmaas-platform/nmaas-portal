import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClusterManagerDetailsComponent } from './managerdetails.component';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { of, BehaviorSubject } from 'rxjs';
import { ClusterManager } from '../../../../model/cluster-manager';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IngressCertificateConfigOption, IngressControllerConfigOption, IngressResourceConfigOption, NamespaceConfigOption } from '../../../../model/cluster';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserDataService } from '../../../../service/userdata.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ClusterManagerDetailsComponent', () => {
  let component: ClusterManagerDetailsComponent;
  let fixture: ComponentFixture<ClusterManagerDetailsComponent>;
  let clusterService: jasmine.SpyObj<ClusterManagerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let userDataService: jasmine.SpyObj<UserDataService>;

  const mockCluster: ClusterManager = {
    id: 1,
    name: 'Test Cluster',
    state: "UP",
    currentStateSince: new Date('2025-01-01'),
    contactEmail: "test@test.test",
    description: 'Test Description',
    externalNetworks: [],
    creationDate: new Date('2025-01-01'),
    modificationDate: new Date('2025-02-01'),
    codename: 'test-cluster',
    pathConfigFile: '/path/to/config.yaml',
    clusterConfigFile: 'Config',
    domainNames: ["test"],
    ingress: {
      id: 1,
      controllerConfigOption: IngressControllerConfigOption.USE_EXISTING,
      controllerChartName: 'nginx-ingress',
      controllerChartArchive: 'nginx-ingress-1.0.0.tgz',
      resourceConfigOption: IngressResourceConfigOption.DEPLOY_FROM_CHART,
      externalServiceDomain: 'example.com',
      tlsSupported: true,
      supportedIngressClass: 'nginx',
      certificateConfigOption: IngressCertificateConfigOption.USE_LETSENCRYPT,
      issuerOrWildcardName: 'letsencrypt',
      ingressPerDomain: false,
      publicIngressClass: 'nginx-public',
      publicServiceDomain: 'public.example.com'
    },
    deployment: {
      id: 1,
      smtpServerHostname: 'smtp.example.com',
      smtpServerPort: '587',
      smtpServerUsername: 'user@example.com',
      smtpServerPassword: 'password',
      defaultNamespace: 'default',
      defaultStorageClass: 'standard',
      namespaceConfigOption: NamespaceConfigOption.USE_DEFAULT_NAMESPACE,
      forceDedicatedWorkers: false
    }
  };

  beforeEach(waitForAsync(() => {
    const clusterServiceSpy = jasmine.createSpyObj('ClusterManagerService', ['getClusterDetails', 'sendCluster', 'updateCluster']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const userDataServiceSpy = jasmine.createSpyObj('UserDataService', [], {
      selectedDomainId: new BehaviorSubject<number>(1).asObservable()
    });
    mockActivatedRoute = {
      params: of({ id: 1 })
    };

    TestBed.configureTestingModule({
    declarations: [ClusterManagerDetailsComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    imports: [FormsModule,
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        { provide: ClusterManagerService, useValue: clusterServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UserDataService, useValue: userDataServiceSpy },
        DatePipe,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();

    clusterService = TestBed.inject(ClusterManagerService) as jasmine.SpyObj<ClusterManagerService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    userDataService = TestBed.inject(UserDataService) as jasmine.SpyObj<UserDataService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterManagerDetailsComponent);
    component = fixture.componentInstance;

    component.controllerConfigOption = new Map<string, IngressControllerConfigOption>();
    component.resourceConfigOption = new Map<string, IngressResourceConfigOption>();
    component.namespaceConfigOption = new Map<string, NamespaceConfigOption>();
    component.certificateConfigOption = new Map<string, IngressCertificateConfigOption>();

    clusterService.getClusterDetails.and.returnValue(of(mockCluster));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch cluster details', () => {
    expect(clusterService.getClusterDetails).toHaveBeenCalledWith(1);
    expect(component.cluster).toEqual(mockCluster);
  });

  it('should add a new network', () => {
    component.cluster = { ...mockCluster, externalNetworks: [] };
    component.addNetwork();
    expect(component.cluster.externalNetworks.length).toBe(1);
  });

  it('should remove a network by id', () => {
    component.cluster = {
      ...mockCluster,
      externalNetworks: [{
          id: 1,
          assigned: false,
          assignedSince: '',
          assignedTo: '',
          externalIp: '',
          externalNetwork: '',
          externalNetworkMaskLength: 0
      }, {
          id: 2,
          assigned: false,
          assignedSince: '',
          assignedTo: '',
          externalIp: '',
          externalNetwork: '',
          externalNetworkMaskLength: 0
      }]
    };
    component.removeNetwork(1);
    expect(component.cluster.externalNetworks.length).toBe(1);
    expect(component.cluster.externalNetworks[0].id).toBe(2);
  });

  it('should format date correctly', () => {
    const date = new Date('2025-01-01T12:00:00');
    const formattedDate = component.formatDate(date);
    expect(formattedDate).toBe('01-01-2025 12:00');
  });

  it('should submit updated cluster', () => {
    const updatedCluster = { ...mockCluster, name: 'Updated Cluster' };
    clusterService.updateCluster.and.returnValue(of(updatedCluster));

    component.cluster = mockCluster;
    component.submit();

    expect(clusterService.updateCluster).toHaveBeenCalledWith(mockCluster);
    expect(component.cluster).toEqual(updatedCluster);
  });

  it('should send cluster with file', () => {
    const mockFile = new File(['test content'], 'test.yaml', { type: 'application/x-yaml' });
    const mockEvent = { files: [mockFile] };
    const mockResponse: ClusterManager = {
      id: 1,
      name: 'Test Cluster',
      state:"UP",
      currentStateSince: new Date('2025-01-01'),
      contactEmail: "test@test.test",
      description: 'Test Description',
      externalNetworks: [],
      creationDate: new Date('2025-01-01'),
      modificationDate: new Date('2025-02-01'),
      codename: 'test-cluster',
      pathConfigFile: '/path/to/config.yaml',
      clusterConfigFile: 'Config',
      ingress: null,
      deployment: null,
      domainNames: ["test"]
    };

    clusterService.updateCluster.and.returnValue(of(mockResponse));

    component.submit();

    expect(clusterService.updateCluster).toHaveBeenCalledTimes(1);
  });

  it('should handle domain selection', () => {
    const mockDomain = 'test-domain';
    component.onDomainSelection(mockDomain);
    expect(component.selectedDomain).toBe(mockDomain);
    expect(component.cluster.domainNames).toEqual([mockDomain]);
  });

  it('should subscribe to selectedDomainId from UserDataService', () => {
    userDataService.selectedDomainId.subscribe(domainId => {
      expect(domainId).toBe(1);
    });
  });
});