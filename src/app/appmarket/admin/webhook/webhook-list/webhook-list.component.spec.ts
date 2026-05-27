import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebhookListComponent } from './webhook-list.component';
import { WebhookService } from '../../../../service/webhook.service';
import {BehaviorSubject, of} from 'rxjs';
import { ModalComponent } from '../../../../shared';
import { Webhook, WebhookType } from '../../../../model/webhook';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {ToastContainerComponent} from '../../../../shared/toast-container/toast-container.component';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';
import {FormsModule} from '@angular/forms';

class TranslateFakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

class MockWebhookService {
  getAll = jasmine.createSpy().and.returnValue(of([{ id: 1, name: 'Test', eventType: 'DOMAIN_ACTION', targetUrl: 'http://test' }]));
  create = jasmine.createSpy().and.returnValue(of({}));

  getAllPageable = jasmine.createSpy().and.returnValue(of({
    content: [],
    totalPages: 0,
    totalElements: 0
  }));

  getByDomainPageable = jasmine.createSpy().and.returnValue(of({
    content: [],
    totalPages: 0,
    totalElements: 0
  }));
}

class MockModalComponent {
  show = jasmine.createSpy();
  hide = jasmine.createSpy();
}

describe('WebhookListComponent', () => {
  let component: WebhookListComponent;
  let fixture: ComponentFixture<WebhookListComponent>;
  let service: MockWebhookService;
  let mockToast: jasmine.SpyObj<ToastContainerComponent>;

  beforeEach(async () => {
    const userDataServiceSpy = jasmine.createSpyObj('UserDataService', [], {
      selectedDomainId: new BehaviorSubject<number>(1).asObservable()
    });
    const domainServiceSpy = jasmine.createSpyObj('DomainService', ['getMyDomains', 'getGlobalDomainId']);
    domainServiceSpy.getMyDomains.and.returnValue(of([]));
    domainServiceSpy.getGlobalDomainId.and.returnValue(1);
    mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);
    await TestBed.configureTestingModule({
      declarations: [WebhookListComponent],
      imports: [
        FormsModule,
        TranslateModule.forRoot({
                            loader: {
                                provide: TranslateLoader,
                                useClass: TranslateFakeLoader
                            }
                        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: WebhookService, useClass: MockWebhookService },
        { provide: ToastContainerComponent, useValue: mockToast },
        { provide: UserDataService, useValue: userDataServiceSpy },
        { provide: DomainService, useValue: domainServiceSpy },
      ]
    })
    .overrideComponent(WebhookListComponent, {
      set: {
        providers: [],
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebhookListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(WebhookService) as any;
    component.modal = new MockModalComponent() as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined component instance', () => {
    expect(component).toBeDefined();
  });

  it('should render the component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });
  

  it('should open modal and set default event type', () => {
    component.openModal();
    expect(component.addedWebhook.eventType).toBe(WebhookType.DOMAIN_ACTION);
    expect(component.modal.show).toHaveBeenCalled();
  });

  it('should call service.create and hide modal on closeModalAndSaveWebhook', () => {
    component.selectedDomain = 1;
    component.domainGlobalId = 1;
    component.addedWebhook = { name: 'Test', eventType: 'DOMAIN_ACTION', targetUrl: 'http://test' } as Webhook;
    component.closeModalAndSaveWebhook();
    expect(service.create).toHaveBeenCalled()
    expect(component.modal.hide).toHaveBeenCalled();
  });

  it('should set addedWebhook.eventType on type select', () => {
    component.onTypeSelect('USER_ASSIGNMENT');
    expect(component.addedWebhook.eventType).toBe('USER_ASSIGNMENT');
  });

});
