import { TestBed, inject } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {AppConfigService} from "./appconfig.service";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [NotificationService, AppConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
  });

  it('should be created', inject([NotificationService], (service: NotificationService) => {
    expect(service).toBeTruthy();
  }));
});
