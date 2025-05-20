import { Component, OnInit, ViewChild } from '@angular/core';
import { Webhook, WebhookType } from '../../../../model/webhook';
import { ModalComponent } from '../../../../shared';
import { WebhookService } from '../../../../service/webhook.service';

@Component({
  selector: 'app-webhook-list',
  templateUrl: './webhook-list.component.html',
  styleUrl: './webhook-list.component.css'
})
export class WebhookListComponent implements OnInit {

  public webkooks: Webhook[] = [];

  public addedWebhook: Webhook = new Webhook();
  public maxItemsOnPage = 15;

  public authRequired: boolean = false;

  public type =[
    { name: "DOMAIN_CREATION", value: "DOMAIN_CREATION" },  
    { name: "APPLICATION_DEPLOYMENT", value: "APPLICATION_DEPLOYMENT" },
    { name: "USER_ASSIGNMENT", value: "USER_ASSIGNMENT" },
    { name: "DOMAIN_GROUP_CHANGE", value: "DOMAIN_GROUP_CHANGE" }
  ]

  @ViewChild(ModalComponent, { static: true })
  public modal: ModalComponent;


  constructor(private service: WebhookService) {
    }  

  ngOnInit() {
   this.refreshList();
  }

  public refreshList() {
    this.service.getAll().subscribe(result => {
      this.webkooks = result;
    })
  }

  onTypeSelect(event: any) {
    console.log(event);
    this.addedWebhook.eventType = event;
  }

  public openModal() {
    this.addedWebhook.eventType = WebhookType.DOMAIN_CREATION
      this.modal.show();
  }

  public closeModalAndSaveWebhook() {
    this.service.create(this.addedWebhook).subscribe(result => {
       this.modal.hide();
       this.refreshList();
    });
   
  }

}
