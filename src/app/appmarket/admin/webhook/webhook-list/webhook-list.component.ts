import { Component, OnInit, ViewChild } from '@angular/core';
import { Webhook, WebhookType } from '../../../../model/webhook';
import { ModalComponent } from '../../../../shared';
import { WebhookService } from '../../../../service/webhook.service';
import {ToastContainerComponent, ToastMode} from '../../../../shared/toast-container/toast-container.component';
import {DomainGroup} from '../../../../model/domaingroup';
import {TranslateService} from '@ngx-translate/core';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {debounceTime} from 'rxjs';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';

@Component({
    selector: 'app-webhook-list',
    templateUrl: './webhook-list.component.html',
    styleUrl: './webhook-list.component.css',
    standalone: false
})
export class WebhookListComponent implements OnInit {

  public webhooks: Webhook[] = [];

  public addedWebhook: Webhook = new Webhook();
  public maxItemsOnPage = 15;
  public searchValue = '';
  filteredWebhooks: Webhook[] = [];
  private pipeRefresh: any;
  public domains = [];
  public newWebhookSelectedDomain;
  public selectedDomain;
  public domainGlobalId

  public authRequired: boolean = false;

  public globalType = [
    { name: "DOMAIN_ACTION", value: "DOMAIN_ACTION" },
    { name: "DOMAIN_GROUP_ACTION", value: "DOMAIN_GROUP_ACTION" },
    { name: "APPLICATION_DEPLOYMENT", value: "APPLICATION_DEPLOYMENT" },
    { name: "APPLICATION_REMOVAL", value: "APPLICATION_REMOVAL"},
    { name: "USER_ASSIGNMENT", value: "USER_ASSIGNMENT" }
  ]
  public domainType = [
    { name: "APPLICATION_DEPLOYMENT", value: "APPLICATION_DEPLOYMENT" },
    { name: "APPLICATION_REMOVAL", value: "APPLICATION_REMOVAL"},
    { name: "USER_ASSIGNMENT", value: "USER_ASSIGNMENT" }
  ]
  public type = this.globalType

  @ViewChild(ModalComponent, { static: true })
  public modal: ModalComponent;

  @ViewChild('rowMenu') rowMenu!: Menu;
  rowMenuItems: MenuItem[] = [];


  constructor(private service: WebhookService,
              private toast: ToastContainerComponent,
              public translate: TranslateService,
              public userDataService: UserDataService,
              public domainService: DomainService) {
    this.refreshList();
    }

  ngOnInit() {
    this.domainGlobalId = this.domainService.getGlobalDomainId();
    this.domainService.getMyDomains().subscribe(result => {
      this.domains = result.filter(d => d.id !== this.domainService.getGlobalDomainId());
    });


  }
  ngOnDestroy(): void {
    this.pipeRefresh.unsubscribe();
    this.pipeRefresh = null;
  }

  public refreshList() {
    this.pipeRefresh = this.userDataService.selectedDomainId.pipe(debounceTime(300)).subscribe((domainId) => {
      this.selectedDomain = domainId;
      if (domainId !== this.domainGlobalId) {
        this.type = this.domainType;
        this.service.getByDomain(domainId).subscribe(result => {
          console.log(result);
          this.webhooks = result;
          this.filterWebhooks()
        });
      } else {
        this.type = this.globalType;
        this.service.getAll().subscribe(result => {
          this.webhooks = result;
          console.log(result);
          this.filterWebhooks()

        })
      }
    });
  }

  onTypeSelect(event: any) {
    console.log(event);
    this.addedWebhook.eventType = event;
  }

  onDomainSelect(domainId: string) {
    this.newWebhookSelectedDomain = domainId;
  }

  public openModal() {
    this.addedWebhook.eventType = WebhookType.DOMAIN_ACTION
      this.modal.show();
  }

  public closeModalAndSaveWebhook() {
    if (this.selectedDomain !== this.domainGlobalId) {
      this.addedWebhook.domain = { id: this.selectedDomain };
      this.service.createByDomain(this.selectedDomain, this.addedWebhook).subscribe(result => {
        this.modal.hide();
        this.refreshList();
        this.addedWebhook = new Webhook();
      })
    } else {
      this.service.create(this.addedWebhook).subscribe(result => {
        this.toast.show('TOAST.SUCCESS.NEW_WEBHOOK', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER')
        this.modal.hide();
        this.refreshList();
        this.addedWebhook = new Webhook();
      });
    }
  }

  filterWebhooks() {
    const value = this.searchValue?.toLowerCase() || '';
    this.filteredWebhooks = this.webhooks.filter(webhook =>
        webhook.name?.toLowerCase().includes(value) ||
        webhook.id?.toString().includes(value)
    );
  }

  public removeWebhook(id: number) {
    if (this.selectedDomain !== this.domainGlobalId) {
      this.service.removeByDomain(this.selectedDomain, id).subscribe(() => {
        this.refreshList();
      }, error => {
        console.error('Error removing webhook:', error);
      });
    } else {
      this.service.remove(id).subscribe(() => {
        this.refreshList();
      }, error => {
        console.error('Error removing webhook:', error);
      });
    }
  }
  openRowMenu(event: Event, webhook: Webhook) {

    this.rowMenuItems = [
      {
        label: this.translate.instant( 'WEBHOOKS.REMOVE'),
        command: () => this.removeWebhook(webhook.id)
      }
    ];

    this.rowMenu.toggle(event);
  }
}
