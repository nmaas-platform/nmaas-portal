import { TestBed } from '@angular/core/testing';

import { ResourcesLimitService } from './resources-limit.service';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('ResourcesLimitService', () => {
  let service: ResourcesLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourcesLimitService, HttpClient, HttpHandler]
    });
    service = TestBed.inject(ResourcesLimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
