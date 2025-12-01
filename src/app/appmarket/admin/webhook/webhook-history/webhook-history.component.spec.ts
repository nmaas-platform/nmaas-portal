import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebhookHistoryComponent } from './webhook-history.component';
import {ActivatedRoute, Router} from '@angular/router';
import {WebhookService} from '../../../../service/webhook.service';
import {of} from 'rxjs';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

class MockWebhookService {
  getAllHistory = jasmine.createSpy().and.returnValue(of([{ id: 1, domainCodename: 'Test', eventType: 'DOMAIN_CREATION',
    url: 'http://test', responseStatus: 200 }]));
}
class MockActivatedRoute {
  queryParams = of({ eventType: 'DOMAIN_CREATION', domainCodename: 'Test'});
}


describe('WebhookHistoryComponent', () => {
  let component: WebhookHistoryComponent;
  let fixture: ComponentFixture<WebhookHistoryComponent>;
  let service: MockWebhookService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebhookHistoryComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: WebhookService, useClass: MockWebhookService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(WebhookHistoryComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(WebhookService) as any;
    component.filterDate = [null, null] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(service.getAllHistory).toHaveBeenCalled();
  });
});
