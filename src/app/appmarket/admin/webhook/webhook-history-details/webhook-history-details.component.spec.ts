import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebhookHistoryDetailsComponent } from './webhook-history-details.component';
import {WebhookService} from '../../../../service/webhook.service';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';

class MockWebhookService {
  getOneHistory = jasmine.createSpy().and.returnValue(of({ id: 1, domainCodename: 'Test', eventType: 'DOMAIN_CREATION',
    url: 'http://test', responseStatus: 200 }));
}

class MockActivatedRoute {
  params = of({ id: 1 });
}

describe('WebhookHistoryDetailsComponent', () => {
  let component: WebhookHistoryDetailsComponent;
  let fixture: ComponentFixture<WebhookHistoryDetailsComponent>;
  let service: MockWebhookService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebhookHistoryDetailsComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      providers: [
        { provide: WebhookService, useClass: MockWebhookService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebhookHistoryDetailsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(WebhookService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch webhook by id', () => {
    expect(service.getOneHistory).toHaveBeenCalledWith(1);
  });
});
