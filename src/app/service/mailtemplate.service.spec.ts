import { TestBed } from '@angular/core/testing';

import { MailTemplateService } from './mailtemplate.service';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {AppConfigService} from "./appconfig.service";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MailtemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [AppConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}));

  it('should be created', () => {
    const service: MailTemplateService = TestBed.get(MailTemplateService);
    expect(service).toBeTruthy();
  });
});
