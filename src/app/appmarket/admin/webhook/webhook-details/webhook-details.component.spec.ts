import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebhookDetailsComponent } from './webhook-details.component';
import { WebhookService } from '../../../../service/webhook.service';
import { ActivatedRoute, Router } from '@angular/router';
import {BehaviorSubject, of} from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Webhook } from '../../../../model/webhook';
import {  TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {ToastContainerComponent} from '../../../../shared/toast-container/toast-container.component';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';

class TranslateFakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

class MockWebhookService {
  getOne = jasmine.createSpy().and.returnValue(of({ id: 1, name: 'Test', eventType: 'DOMAIN_CREATION', targetUrl: 'http://test' }));
  update = jasmine.createSpy().and.returnValue(of({ id: 1, name: 'Updated', eventType: 'DOMAIN_CREATION', targetUrl: 'http://test' }));
}

class MockActivatedRoute {
  params = of({ id: 1 });
}

class MockRouter {}

describe('WebhookDetailsComponent', () => {
  let component: WebhookDetailsComponent;
  let fixture: ComponentFixture<WebhookDetailsComponent>;
  let service: MockWebhookService;
  let mockToast: jasmine.SpyObj<ToastContainerComponent>;

  beforeEach(async () => {
    const userDataServiceSpy = jasmine.createSpyObj('UserDataService', [], {
      selectedDomainId: new BehaviorSubject<number>(1).asObservable()
    });
    const domainServiceSpy = jasmine.createSpyObj('DomainService', ['getGlobalDomainId']);
    domainServiceSpy.getGlobalDomainId.and.returnValue(1);
    mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);
    await TestBed.configureTestingModule({
      declarations: [WebhookDetailsComponent],
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      providers: [
        { provide: WebhookService, useClass: MockWebhookService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        { provide: ToastContainerComponent, useValue: mockToast },
        { provide: UserDataService, useValue: userDataServiceSpy },
        { provide: DomainService, useValue: domainServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WebhookDetailsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(WebhookService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch webhook by id', () => {
    expect(component.webhooksId).toBe(1);
    expect(service.getOne).toHaveBeenCalledWith(1);
    expect(component.webhook).toBeDefined();
    expect(component.webhook.id).toBe(1);
  });

});
