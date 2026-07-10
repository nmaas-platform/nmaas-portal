import {Component, OnInit, ViewChild} from '@angular/core';
import {Webhook} from '../../../../model/webhook';
import {ModalComponent} from '../../../../shared';
import {WebhookService} from '../../../../service/webhook.service';
import {ToastContainerComponent, ToastMode} from '../../../../shared/toast-container/toast-container.component';
import {TranslateService} from '@ngx-translate/core';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';
import {PaginationSettings, PrimeNgLazyLoadEvent} from '../../../../service/page';
import {WebhookTemplatesService} from '../../../../service/webhook-templates.service';

@Component({
    selector: 'app-webhook-list',
    templateUrl: './webhook-list.component.html',
    styleUrl: './webhook-list.component.css',
    standalone: false
})
export class WebhookListComponent implements OnInit {

    public webhooks: Webhook[] = [];

    public addedWebhook: Webhook = new Webhook();
    public searchValue = '';
    filteredWebhooks: Webhook[] = [];
    private pipeRefresh: any;
    public domains = [];
    public newWebhookSelectedDomain;
    public selectedDomain;
    public domainGlobalId

    public authRequired: boolean = false;
    public templateRequired: boolean = false;
    public supportedVariables;

    public globalType = [
        {name: 'DOMAIN_ACTION', value: 'DOMAIN_ACTION'},
        {name: 'DOMAIN_GROUP_ACTION', value: 'DOMAIN_GROUP_ACTION'},
        {name: 'APPLICATION_DEPLOYMENT', value: 'APPLICATION_DEPLOYMENT'},
        {name: 'APPLICATION_REMOVAL', value: 'APPLICATION_REMOVAL'},
        {name: 'USER_ASSIGNMENT', value: 'USER_ASSIGNMENT'}
    ]
    public domainType = [
        {name: 'APPLICATION_DEPLOYMENT', value: 'APPLICATION_DEPLOYMENT'},
        {name: 'APPLICATION_REMOVAL', value: 'APPLICATION_REMOVAL'},
        {name: 'USER_ASSIGNMENT', value: 'USER_ASSIGNMENT'}
    ]
    public type = this.globalType

    @ViewChild(ModalComponent, {static: true})
    public modal: ModalComponent;

    @ViewChild('rowMenu') rowMenu!: Menu;
    rowMenuItems: MenuItem[] = [];


    public paginationSettings: PaginationSettings = new PaginationSettings(0, 15, 1, 'id', 'asc', {}, 0);
    public loading: boolean = false;
    private lazyLoadSubject = new Subject<PrimeNgLazyLoadEvent>();
    private debounceTimeMs = 300;
    public pageNumber = 1;
    public maxItemsOnPage = 15;

    constructor(private readonly service: WebhookService,
                private readonly toast: ToastContainerComponent,
                public translate: TranslateService,
                public userDataService: UserDataService,
                public domainService: DomainService,
                private readonly webhookTemplatesService: WebhookTemplatesService) {
    }

    ngOnInit() {
        this.domainGlobalId = this.domainService.getGlobalDomainId();
        this.domainService.getMyDomains().subscribe(result => {
            this.domains = result.filter(d => d.id !== this.domainService.getGlobalDomainId());
            this.newWebhookSelectedDomain = this.domains[0].id;
        });
        this.lazyLoadSubject.pipe(
            debounceTime(this.debounceTimeMs),
            distinctUntilChanged((prev, curr) =>
                JSON.stringify(prev) === JSON.stringify(curr)
            )
        ).subscribe(event => {
            this.lazyLoad(event);
        });

        this.refreshList();

    }

    ngOnDestroy(): void {
        this.lazyLoadSubject.complete();
        this.lazyLoadSubject.unsubscribe();
    }

    private setPaginationSettings(page: any): void {
        this.paginationSettings.totalPages = page.totalPages;
        this.paginationSettings.totalElements = page.totalElements;
    }

    onTableLazyLoad(event: PrimeNgLazyLoadEvent): void {
        this.lazyLoadSubject.next(event);
    }

    private lazyLoad(event?: PrimeNgLazyLoadEvent) {
        this.loading = true;

        if (event) {
            this.paginationSettings.maxItemsOnPage = event.rows;
            this.paginationSettings.pageNumber = (event.rows > 0) ? Math.floor(event.first / event.rows) + 1 : 1;

            this.paginationSettings.sortField = event.sortField || 'id';
            this.paginationSettings.sortOrder = event.sortOrder === 1 ? 'asc' : (event.sortOrder === -1 ? 'desc' : 'asc');

        }
        const paginatorEventForService: PrimeNgLazyLoadEvent = {
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: {}
        };

        if (this.selectedDomain !== this.domainGlobalId) {
            this.service.getByDomainPageable(
                this.selectedDomain,
                paginatorEventForService,
                this.searchValue
            ).subscribe({
                next: (page) => {
                    this.setPaginationSettings(page);
                    this.webhooks = page.content;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error fetching domain data:', error);
                    this.loading = false;
                }
            });
        } else {
            this.service.getAllPageable(
                paginatorEventForService,
                this.searchValue
            ).subscribe({
                next: (page) => {
                    this.setPaginationSettings(page);
                    this.webhooks = page.content;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error fetching data:', error);
                    this.loading = false;
                }
            });
        }

    }

    applyFilter(): void {
        console.log('Applying filter with searchValue:', this.searchValue);
        this.paginationSettings.pageNumber = 1;
        this.paginationSettings.totalElements = 0;
        this.lazyLoadSubject.next({
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: {searchValue: this.searchValue}
        });
    }

    clearFilter(): void {
        this.searchValue = '';
        this.paginationSettings.pageNumber = 1;
        this.paginationSettings.totalElements = 0;
        this.lazyLoadSubject.next({
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: {}
        });
    }

    onSearchValueChange(event: any): void {
        if ((!this.searchValue || this.searchValue.trim() === '')) {
            this.clearFilter();
        }

    }

    public refreshList() {
        this.pipeRefresh = this.userDataService.selectedDomainId
            .pipe(debounceTime(300))
            .subscribe((domainId) => {

                this.selectedDomain = domainId;

                if (domainId !== this.domainGlobalId) {
                    this.type = this.domainType;
                } else {
                    this.type = this.globalType;
                }

                this.paginationSettings.pageNumber = 1;

                this.lazyLoad();
            });
    }

    onTypeSelect(event: any) {
        console.log(event);
        this.addedWebhook.eventType = event;
        if(this.templateRequired) {
            this.onTemplateSelect(event)
        }
    }

    onTemplateSelect(event: any) {
        if(this.templateRequired) {
        this.webhookTemplatesService.getDefaultTemplate(event).subscribe(
            (template) => {
                this.addedWebhook.template = template;
            }
        );
        this.webhookTemplatesService.getVariables(event).subscribe(
            (variables) => {
                this.supportedVariables = variables;
            }
        )
        }else{
            this.addedWebhook.template = undefined;
        }
    }

    onDomainSelect(domainId: string) {
        this.newWebhookSelectedDomain = domainId;
    }

    public openModal() {
        this.onTypeSelect(this.type[0].value)
        this.modal.show();
    }

    public closeModalAndSaveWebhook() {
        if (this.selectedDomain !== this.domainGlobalId) {
            this.addedWebhook.domain = {id: this.selectedDomain};
            this.service.createByDomain(this.selectedDomain, this.addedWebhook).subscribe(result => {
                this.modal.hide();
                this.refreshList();
                this.addedWebhook = new Webhook();
            })
        } else {
            if( this.addedWebhook.eventType == `DOMAIN_ACTION` ||  this.addedWebhook.eventType == `DOMAIN_GROUP_ACTION`) {
                this.service.create(this.addedWebhook).subscribe(result => {
                    this.toast.show('TOAST.SUCCESS.NEW_WEBHOOK', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER')
                    this.modal.hide();
                    this.refreshList();
                    this.addedWebhook = new Webhook();
                });
            }else{
                this.addedWebhook.domain = {id: this.newWebhookSelectedDomain};
                this.service.createByDomain(this.newWebhookSelectedDomain, this.addedWebhook).subscribe(result => {
                    this.modal.hide();
                    this.refreshList();
                    this.addedWebhook = new Webhook();
                })
            }
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
                label: this.translate.instant('WEBHOOKS.HISTORY.HISTORY'),
                routerLink: ['/admin/webhooks/history'],
                queryParams: {eventId: webhook.id}
            },
            {
                label: this.translate.instant('WEBHOOKS.REMOVE'),
                command: () => this.removeWebhook(webhook.id)
            }
        ];

        this.rowMenu.toggle(event);
    }


}
