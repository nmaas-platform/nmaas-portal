import {TestBed} from '@angular/core/testing';

import {AppLogsService} from './app-logs.service';

describe('AppLogsServiceService', () => {
  let service: AppLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});