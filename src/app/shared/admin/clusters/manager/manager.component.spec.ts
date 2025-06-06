import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClusterManagerComponent } from './manager.component';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ClusterManager } from '../../../../model/cluster-manager';
import { ModalComponent } from '../../../modal';

describe('ClusterManagerComponent', () => {
  let component: ClusterManagerComponent;
  let fixture: ComponentFixture<ClusterManagerComponent>;
  let clusterService: jasmine.SpyObj<ClusterManagerService>;
  let mockClusters: any[];
  let mockModal: jasmine.SpyObj<ModalComponent>;


  beforeEach(async () => {
    const clusterServiceSpy = jasmine.createSpyObj('ClusterManagerService', ['getAllClusters', 'sendCluster']);
    const mockModalSpy = jasmine.createSpyObj('ModalComponent', ['hide']);
    mockModalSpy.hide.and.returnValue(null);

    mockClusters = [
      {
        id: 1,
        name: 'Cluster A',
        codename: 'CodeA',
        creationDate: new Date('2025-01-01'),
        modificationDate: new Date('2025-02-01'),
        pathConfigFile: '/path/to/configA.yaml',
        description: 'Description A',
        clusterConfigFile: 'ConfigA',
        ingress: {
          id: 1,
          controllerConfigOption: 'OptionA',
          controllerChartName: 'ChartA',
          controllerChartArchive: 'ArchiveA',
          resourceConfigOption: 'ResourceA',
          externalServiceDomain: 'domainA.com',
          tlsSupported: true,
          supportedIngressClass: 'ClassA',
          certificateConfigOption: 'CertOptionA',
          issuerOrWildcardName: 'WildcardA',
          ingressPerDomain: false,
          publicIngressClass: 'PublicClassA',
          publicServiceDomain: 'public.domainA.com'
        },
        deployment: {
          smtpServerHostname: 'smtp.domainA.com',
          smtpServerPort: '587',
          smtpServerUsername: 'userA',
          smtpServerPassword: 'passwordA',
          defaultNamespace: 'namespaceA',
          defaultStorageClass: 'storageClassA',
          id: 1,
          namespaceConfigOption: 'OptionA',
          forceDedicatedWorkers: true
        },
        externalNetworks: [
          {
            assigned: true,
            assignedSince: '2025-01-01',
            assignedTo: 'UserA',
            externalIp: '192.168.1.1',
            externalNetwork: 'NetworkA',
            externalNetworkMaskLength: 24,
            id: 1
          }
        ]
      },
      {
        id: 2,
        name: 'Cluster B',
        codename: 'CodeB',
        creationDate: new Date('2025-01-15'),
        modificationDate: new Date('2025-02-15'),
        pathConfigFile: '/path/to/configB.yaml',
        description: 'Description B',
        clusterConfigFile: 'ConfigB',
        ingress: 'IngressB',
        deployment: 'DeploymentB',
        externalNetworks: []
      }
    ];

    clusterServiceSpy.getAllClusters.and.returnValue(of(mockClusters));

    await TestBed.configureTestingModule({
      declarations: [ClusterManagerComponent],
      imports: [HttpClientTestingModule,
        TranslateModule.forRoot({
                            loader: {
                                provide: TranslateLoader,
                                useClass: TranslateFakeLoader
                            }
                        }),
      ],
      providers: [
        { provide: ClusterManagerService, useValue: clusterServiceSpy }
      ],
       schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ClusterManagerComponent);
    component = fixture.componentInstance;
    component.modal = mockModalSpy;
    clusterService = TestBed.inject(ClusterManagerService) as jasmine.SpyObj<ClusterManagerService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllClusters on initialization', () => {
    component.getAllClusters();
    expect(clusterService.getAllClusters).toHaveBeenCalled();
    expect(component.clusters).toEqual(mockClusters);
  });

  it('should call saveFile and store the uploaded file', () => {
    const mockFile = new File(['test content'], 'test.yaml', { type: 'application/x-yaml' });
    const mockEvent = { files: [mockFile] };

    component.saveFile(mockEvent);

    expect(component.updatedFile).toBe(mockFile);
    expect(component.updatedFile.name).toBe('test.yaml');
  });


});