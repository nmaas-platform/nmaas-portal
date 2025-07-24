import { Component, OnInit, ViewChild } from '@angular/core';
import { Webhook, WebhookType } from '../../../../model/webhook';
import { ModalComponent } from '../../../../shared';
import { WebhookService } from '../../../../service/webhook.service';
import {ToastContainerComponent, ToastMode} from '../../../../shared/toast-container/toast-container.component';

@Component({
    selector: 'app-webhook-list',
    templateUrl: './webhook-list.component.html',
    styleUrl: './webhook-list.component.css',
    standalone: false
})
export class WebhookListComponent implements OnInit {

  public webkooks: Webhook[] = [];

  public addedWebhook: Webhook = new Webhook();
  public maxItemsOnPage = 15;
  public searchValue = '';
  filteredWebhooks: Webhook[] = [];

  public authRequired: boolean = false;

  public type = [
    { name: "DOMAIN_ACTION", value: "DOMAIN_ACTION" },
    { name: "DOMAIN_GROUP_ACTION", value: "DOMAIN_GROUP_ACTION" },
    { name: "APPLICATION_DEPLOYMENT", value: "APPLICATION_DEPLOYMENT" },
    { name: "USER_ASSIGNMENT", value: "USER_ASSIGNMENT" }
  ]

  @ViewChild(ModalComponent, { static: true })
  public modal: ModalComponent;


  constructor(private service: WebhookService,
              private toast: ToastContainerComponent) {
    }

  ngOnInit() {
   this.refreshList();
  }

  public refreshList() {
    this.service.getAll().subscribe(result => {
      this.webkooks = result;
      this.filterWebhooks()
    })
  }

  onTypeSelect(event: any) {
    console.log(event);
    this.addedWebhook.eventType = event;
  }

  public openModal() {
    this.addedWebhook.eventType = WebhookType.DOMAIN_ACTION
      this.modal.show();
  }

  public closeModalAndSaveWebhook() {
    this.service.create(this.addedWebhook).subscribe(result => {
      this.toast.show('TOAST.SUCCESS.NEW_WEBHOOK', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER')
       this.modal.hide();
       this.refreshList();
       this.addedWebhook = new Webhook(); 
    });
  }
  

  filterWebhooks() {
    const value = this.searchValue?.toLowerCase() || '';
    this.filteredWebhooks = this.webkooks.filter(webhook =>
        webhook.name?.toLowerCase().includes(value) ||
        webhook.id?.toString().includes(value)
    );
  }

  public removeWebhook(id: number) {
    this.service.remove(id).subscribe(() => {
      this.refreshList();
    }, error => {
      console.error("Error removing webhook:", error);
    });
  }
}
