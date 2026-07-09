import { TestBed } from '@angular/core/testing';

import { WebhookTemplatesService } from './webhook-templates.service';

describe('WebhookTemplatesService', () => {
  let service: WebhookTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebhookTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
