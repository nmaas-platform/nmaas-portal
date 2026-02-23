import { TestBed } from '@angular/core/testing';

import { ShellClientService } from './shell-client.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ShellClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}));

  it('should be created', () => {
    const service: ShellClientService = TestBed.inject(ShellClientService);
    expect(service).toBeTruthy();
  });
});
