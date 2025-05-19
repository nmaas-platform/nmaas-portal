import { TestBed, inject } from '@angular/core/testing';

import { DomainService } from './domain.service';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {AppConfigService} from "./appconfig.service";
import {Observable, of} from "rxjs";
import {Configuration} from "../model/configuration";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Domain } from '../model/domain';

class MockConfigurationService{
    protected uri:string;

    constructor() {
        this.uri = 'http://localhost/api';
    }

    public getApiUrl(): string {
        return 'http://localhost/api';
    }

    public getConfiguration():Observable<Configuration>{
        return of<Configuration>();
    }

    public updateConfiguration(configuration:Configuration):Observable<any>{
        return of<Configuration>();
    }
}



describe('DomainService', () => {
  let service: DomainService;
  let httpMock: HttpTestingController;
  let appConfigService: jasmine.SpyObj<AppConfigService>;
  const mockApiUrl = 'http://localhost/api';

  const mockDomain: Domain = {
    id: 1,
    name: 'Test Domain',
    codename: 'test-domain',
    active: true,
    domainDcnDetails: {
      id: 1,
      domainCodename: 'test-domain',
      dcnConfigured: false,
      dcnDeploymentType: 'type',
      customerNetworks: []
    },
    domainTechDetails: null,
    applicationStatePerDomain: [],
    groups: [],
    deleted: false,
    annotations: [],
    clusters: [],
  };

  beforeEach(() => {
    const appConfigSpy = jasmine.createSpyObj('AppConfigService', ['getApiUrl', 'getNmaasGlobalDomainId', 'getHttpTimeout']);
    appConfigSpy.getApiUrl.and.returnValue(mockApiUrl);
    appConfigSpy.getNmaasGlobalDomainId.and.returnValue(1);
    appConfigSpy.getHttpTimeout.and.returnValue(30000); // Dodano mock dla getHttpTimeout

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DomainService, 
        {provide: AppConfigService, useValue: appConfigSpy}]
    });

    service = TestBed.inject(DomainService);
  httpMock = TestBed.inject(HttpTestingController);
  });
  


  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', inject([DomainService], (service: DomainService) => {
    expect(service).toBeTruthy();
  }));



  it('should get global domain', () => {
    service.getGlobalDomain().subscribe((domain) => {
      expect(domain).toEqual(mockDomain);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/domains/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDomain);
  });

  it('should get all domains', () => {
    const mockDomains: Domain[] = [mockDomain, { ...mockDomain, id: 2, name: 'Another Domain' }];

    service.getAll().subscribe((domains) => {
      expect(domains.length).toBe(2);
      expect(domains).toEqual(mockDomains);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/domains`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDomains);
  });

  it('should add a new domain', () => {
    const mockId= { id: 1 };

    service.add(mockDomain).subscribe((id) => {
      expect(id).toEqual(mockId);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/domains`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDomain);
    req.flush(mockId);
  });

  it('should update a domain', () => {
    service.update(mockDomain).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/domains/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockDomain);
    req.flush({});
  });

  it('should delete a domain', () => {
    service.remove(1).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/domains/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });


  it('should update domain state', () => {
    service.updateDomainState(mockDomain).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/domains/1/state?active=false`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

});
