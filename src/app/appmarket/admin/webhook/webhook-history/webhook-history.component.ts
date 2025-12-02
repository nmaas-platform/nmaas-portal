import {Component, OnInit} from '@angular/core';
import {WebhookService} from '../../../../service/webhook.service';
import {WebhookHistory} from '../../../../model/webhook-history';
import {WebhookType} from '../../../../model/webhook';
import {ActivatedRoute} from '@angular/router';
import {debounceTime} from 'rxjs';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';

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

  private pipeRefresh: any;
  public domains = [];
  public domainGlobalId

  webhookType = [
    { label: "DOMAIN_ACTION", value: "DOMAIN_ACTION" },
    { label: "DOMAIN_GROUP_ACTION", value: "DOMAIN_GROUP_ACTION" },
    { label: "APPLICATION_DEPLOYMENT", value: "APPLICATION_DEPLOYMENT" },
    { label: "APPLICATION_REMOVAL", value: "APPLICATION_REMOVAL"},
    { label: "USER_ASSIGNMENT", value: "USER_ASSIGNMENT" }
  ]

  constructor(private webhookService: WebhookService,
              private route: ActivatedRoute,
              public domainService: DomainService,
              public userDataService: UserDataService) {
  }

  ngOnDestroy(): void {
    this.pipeRefresh.unsubscribe();
    this.pipeRefresh = null;
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filterEventId = params['eventId'];
      this.applyFilters()
    })
    this.domainGlobalId = this.domainService.getGlobalDomainId();
    this.domainService.getMyDomains().subscribe(result => {
      this.domains = result.filter(d => d.id !== this.domainService.getGlobalDomainId());
    });
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

    this.pipeRefresh = this.userDataService.selectedDomainId.pipe(debounceTime(300)).subscribe((domainId) => {
      if (domainId !== this.domainGlobalId) {
        this.webhookService.getAllHistoryByDomain(
            domainId,
            this.filterEventId,
            this.filterEventType,
            fromDate,
            to
        ).subscribe(result => {
          this.filteredWebhooksHistory = result;
        })
      } else {
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
