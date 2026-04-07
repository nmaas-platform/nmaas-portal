import {Component, OnInit} from '@angular/core';
import {WebhookService} from '../../../../service/webhook.service';
import {WebhookHistory} from '../../../../model/webhook-history';
import {WebhookType} from '../../../../model/webhook';
import {ActivatedRoute} from '@angular/router';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';
import {PaginationSettings, PrimeNgLazyLoadEvent} from '../../../../service/page';

@Component({
  selector: 'app-webhook-history',
  templateUrl: './webhook-history.component.html',
  styleUrl: './webhook-history.component.css',
  standalone: false
})
export class WebhookHistoryComponent implements OnInit {

  public filteredWebhooksHistory: WebhookHistory[];
  // public maxItemsOnPage = 15;

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

  public paginationSettings: PaginationSettings = new PaginationSettings(0, 15, 1, 'id', 'asc', {}, 0);
  public loading: boolean = false;
  private lazyLoadSubject = new Subject<PrimeNgLazyLoadEvent>();
  private debounceTimeMs = 300;
  public pageNumber = 1;
  public maxItemsOnPage = 15;

  constructor(private webhookService: WebhookService,
              private route: ActivatedRoute,
              public domainService: DomainService,
              public userDataService: UserDataService) {
  }

  ngOnDestroy(): void {
    if (this.pipeRefresh) {
      this.pipeRefresh.unsubscribe();
      this.pipeRefresh = null;
    }

    this.lazyLoadSubject.complete();
    this.lazyLoadSubject.unsubscribe();
  }


  ngOnInit() {
    this.lazyLoadSubject.pipe(
        debounceTime(this.debounceTimeMs),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(event => {
      this.lazyLoad(event);
    });

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

  onTableLazyLoad(event: PrimeNgLazyLoadEvent): void {
    this.lazyLoadSubject.next(event);
  }

  private lazyLoad(event?: PrimeNgLazyLoadEvent) {
    this.loading = true;

    if (event) {
      this.paginationSettings.maxItemsOnPage = event.rows;
      this.paginationSettings.pageNumber = event.rows > 0
          ? Math.floor(event.first / event.rows) + 1
          : 1;

      this.paginationSettings.sortField = event.sortField || 'id';
      this.paginationSettings.sortOrder =
          event.sortOrder === 1 ? 'asc' : 'desc';
    }

    let fromDate: Date | null
    let toDate: Date | null
    if (this.filterDate) {
      fromDate = this.filterDate[0];
     toDate = this.filterDate[1];
    }
    const to  = toDate ? this.fixedDate(toDate) : null;

    const paginatorEvent: PrimeNgLazyLoadEvent = {
      first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
      rows: this.paginationSettings.maxItemsOnPage,
      sortField: this.paginationSettings.sortField,
      sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
      filters: {}
    };

    this.pipeRefresh = this.userDataService.selectedDomainId
        .pipe(debounceTime(300))
        .subscribe(domainId => {

          if (domainId !== this.domainGlobalId) {
            this.webhookService.getAllHistoryByDomainPageable(
                domainId,
                paginatorEvent,
                this.filterEventId,
                this.filterEventType,
                fromDate,
                to
            ).subscribe({
              next: page => {
                this.paginationSettings.totalElements = page.totalElements;
                this.paginationSettings.totalPages = page.totalPages;
                this.filteredWebhooksHistory = page.content;
                this.loading = false;
              },
              error: () => this.loading = false
            });

          } else {
            this.webhookService.getAllHistoryPageable(
                paginatorEvent,
                this.filterEventId,
                this.filterEventType,
                this.filterDomainCodename,
                fromDate,
                to
            ).subscribe({
              next: page => {
                this.paginationSettings.totalElements = page.totalElements;
                this.paginationSettings.totalPages = page.totalPages;
                this.filteredWebhooksHistory = page.content;
                this.loading = false;
              },
              error: () => this.loading = false
            });
          }
        });
  }


  fixedDate(date: Date) {
    const d = new Date(date);
    d.setHours(23, 59, 999)
    return d
  }

  applyFilters() {
    this.paginationSettings.pageNumber = 1;

    this.lazyLoadSubject.next({
      first: 0,
      rows: this.paginationSettings.maxItemsOnPage,
      sortField: this.paginationSettings.sortField,
      sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
      filters: {}
    });
  }

  clearFilters() {
    this.filterEventId = null;
    this.filterEventType = null;
    this.filterDomainCodename = null;
    this.filterDate = null;
    this.applyFilters();
  }
}
