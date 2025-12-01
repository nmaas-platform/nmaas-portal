import {Component, OnInit} from '@angular/core';
import {WebhookService} from '../../../../service/webhook.service';
import {WebhookHistory} from '../../../../model/webhook-history';
import {WebhookType} from '../../../../model/webhook';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-webhook-history',
  templateUrl: './webhook-history.component.html',
  styleUrl: './webhook-history.component.css',
  standalone: false
})
export class WebhookHistoryComponent implements OnInit {

  public filteredWebhooksHistory: WebhookHistory[];
  public maxItemsOnPage = 15;

  public filterEventId;
  public filterEventType: WebhookType;
  public filterDomainCodename;
  public filterDate: Date | null = null;

  webhookType = [
    { label: "DOMAIN_ACTION", value: "DOMAIN_ACTION" },
    { label: "DOMAIN_GROUP_ACTION", value: "DOMAIN_GROUP_ACTION" },
    { label: "APPLICATION_DEPLOYMENT", value: "APPLICATION_DEPLOYMENT" },
    { label: "APPLICATION_REMOVAL", value: "APPLICATION_REMOVAL"},
    { label: "USER_ASSIGNMENT", value: "USER_ASSIGNMENT" }
  ]

  constructor(private webhookService: WebhookService,
              private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filterEventType = params['eventType'];
      this.filterDomainCodename = params['domainCodename'];
      this.applyFilters()
    })
  }
  getStatusText(status: number): string {
    const statusMap: { [key: string]: string } = {
      200: 'OK',
      400: 'Bad Request',
      404: 'Not Found',
      500: 'Internal Server Error',
    };
    return statusMap[status] || 'Unknown';
  }

  fixedDate(date: Date) {
    const d = new Date(date);
    d.setHours(23, 59, 999)
    return d
  }

  applyFilters() {
    let fromDate: Date | null
    let toDate: Date | null
    if (this.filterDate) {
      fromDate = this.filterDate[0];
      toDate = this.filterDate[1];
    }
    const to  = toDate ? this.fixedDate(toDate) : null;
    this.webhookService.getAllHistory(
        this.filterEventId,
        this.filterEventType,
        this.filterDomainCodename,
        fromDate,
        to
    ).subscribe(result => {
      this.filteredWebhooksHistory = result;
    })
  }

  clearFilters() {
    this.filterEventId = null;
    this.filterEventType = null;
    this.filterDomainCodename = null;
    this.filterDate = null;
    this.applyFilters();
  }
}
