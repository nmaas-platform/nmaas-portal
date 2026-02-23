import { TestBed } from '@angular/core/testing';

import { ConfigTemplateService } from './configtemplate.service';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConfigtemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [ConfigTemplateService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}));

  it('should be created', () => {
    const service: ConfigTemplateService = TestBed.inject(ConfigTemplateService);
    expect(service).toBeTruthy();
  });
});
