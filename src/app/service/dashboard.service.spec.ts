import { TestBed, inject} from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Configuration} from '../model/configuration';
import {AppConfigService} from './appconfig.service';

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

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, HttpHandler, HttpClient, {provide: AppConfigService, useClass: MockConfigurationService}]
    });
    service = TestBed.inject(DashboardService);
  });

  it('should be created', inject([DashboardService], (service: DashboardService) =>{
    expect(service).toBeTruthy();
  }));
});
