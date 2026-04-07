import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { WebhookHistoryComponent } from './webhook-history.component';
import {ActivatedRoute, Router} from '@angular/router';
import {WebhookService} from '../../../../service/webhook.service';
import {BehaviorSubject, of} from 'rxjs';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';

class TranslateFakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

class MockWebhookService {
  getAllHistoryPageable = jasmine.createSpy().and.returnValue(of([{ id: 1, domainCodename: 'Test', eventType: 'DOMAIN_CREATION',
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
    const userDataServiceSpy = jasmine.createSpyObj('UserDataService', [], {
      selectedDomainId: new BehaviorSubject<number>(1).asObservable()
    });
    const domainServiceSpy = jasmine.createSpyObj('DomainService', ['getMyDomains', 'getGlobalDomainId']);
    domainServiceSpy.getMyDomains.and.returnValue(of([]));
    domainServiceSpy.getGlobalDomainId.and.returnValue(1);
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
        { provide: UserDataService, useValue: userDataServiceSpy },
        { provide: DomainService, useValue: domainServiceSpy },
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
  });

});
