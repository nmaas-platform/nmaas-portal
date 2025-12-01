import { Component } from '@angular/core';
import {WebhookService} from '../../../../service/webhook.service';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-webhook-history-details',
  templateUrl: './webhook-history-details.component.html',
  styleUrl: './webhook-history-details.component.css',
  standalone: false
})
export class WebhookHistoryDetailsComponent {
  public webhookHistoryId;
  public webhookHistoryDetails;
  public requestBody;
  public eventType;

  constructor(private webhookService: WebhookService,
              private route: ActivatedRoute,
              public translate: TranslateService) {
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.webhookHistoryId = +params['id'];
    })

    this.webhookService.getOneHistory(this.webhookHistoryId).subscribe(result => {
      this.webhookHistoryDetails = result;
      try {
        this.requestBody = JSON.stringify(JSON.parse(result.requestBody), null, 2);
      } catch (e) {
        this.requestBody = result.requestBody;
      }
      this.eventType = this.translate.instant('WEBHOOKS.' + result.eventType.toString().toUpperCase());
      console.log(result);
    })
  }
}
