import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebhookListComponent } from './webhook-list.component';
import { WebhookService } from '../../../../service/webhook.service';
import { of } from 'rxjs';
import { ModalComponent } from '../../../../shared';
import { Webhook, WebhookType } from '../../../../model/webhook';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {ToastContainerComponent} from '../../../../shared/toast-container/toast-container.component';

class MockWebhookService {
  getAll = jasmine.createSpy().and.returnValue(of([{ id: 1, name: 'Test', eventType: 'DOMAIN_ACTION', targetUrl: 'http://test' }]));
  create = jasmine.createSpy().and.returnValue(of({}));
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
    mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);
    await TestBed.configureTestingModule({
      declarations: [WebhookListComponent],
      imports: [
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
        { provide: ToastContainerComponent, useValue: mockToast }
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

  it('should refresh list and set webkooks', () => {
    component.refreshList();
    expect(service.getAll).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.webkooks.length).toBeGreaterThan(0);
  });

  it('should open modal and set default event type', () => {
    component.openModal();
    expect(component.addedWebhook.eventType).toBe(WebhookType.DOMAIN_ACTION);
    expect(component.modal.show).toHaveBeenCalled();
  });

  it('should call service.create and hide modal on closeModalAndSaveWebhook', () => {
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
