import {TestBed} from '@angular/core/testing';

import {AppLogsService} from './app-logs.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';

describe('AppLogsServiceService', () => {
  let service: AppLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppLogsService, HttpHandler, HttpClient, AppConfigService]
    });
    service = TestBed.inject(AppLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
