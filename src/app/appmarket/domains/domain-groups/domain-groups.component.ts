import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DomainService} from '../../../service';
import {DomainGroupList} from '../../../model/domaingroup';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Page, PaginationSettings, PrimeNgLazyLoadEvent} from '../../../service/page';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-domain-groups',
    templateUrl: './domain-groups.component.html',
    styleUrls: ['./domain-groups.component.css'],
    standalone: false
})
export class DomainGroupsComponent implements OnInit {


    public groups: DomainGroupList[] = [];
    public loading = false;
    public searchValue = '';

    public paginationSettings: PaginationSettings = new PaginationSettings(0, 15, 1, 'id', 'asc', {}, 0);

    @ViewChild('rowMenu') rowMenu!: Menu;
    rowMenuItems: MenuItem[] = [];
    selectedGroup: DomainGroupList | null = null;

    private lazyLoadSubject = new Subject<PrimeNgLazyLoadEvent>();
    private debounceTimeMs = 300;

    constructor(private domainService: DomainService,
                public translate: TranslateService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.lazyLoadSubject.pipe(
            debounceTime(this.debounceTimeMs),
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        ).subscribe(event => this.loadGroups(event));
    }
    ngOnDestroy(): void {
        this.lazyLoadSubject.complete();
        this.lazyLoadSubject.unsubscribe();
    }

    loadGroups(event?: PrimeNgLazyLoadEvent): void {
        this.loading = true;
        this.cdr.detectChanges();

        if (event) {
            this.paginationSettings.maxItemsOnPage = event.rows;
            this.paginationSettings.pageNumber =
                event.rows > 0 ? Math.floor(event.first / event.rows) + 1 : 1;

            this.paginationSettings.sortField = event.sortField || 'id';
            this.paginationSettings.sortOrder =
                event.sortOrder === 1 ? 'asc' : 'desc';
        }

        const paginatorEvent: PrimeNgLazyLoadEvent = {
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: { searchValue: this.searchValue }
        };

        this.domainService.getAllDomainGroupsPageable(
            paginatorEvent,
            this.searchValue
        ).subscribe({
            next: (page: Page<DomainGroupList>) => {
                this.groups = page.content;
                this.paginationSettings.totalElements = page.totalElements;
                this.paginationSettings.totalPages = page.totalPages;
                this.loading = false;
            },
            error: err => {
                console.error(err);
                this.loading = false;
            }
        });
    }
    onTableLazyLoad(event: PrimeNgLazyLoadEvent): void {
        this.lazyLoadSubject.next(event);
    }
    deleteDomainGroup(id: number): void {
        this.domainService.deleteDomainGroup(id).subscribe(() => {
            this.lazyLoadSubject.next({
                first: 0,
                rows: this.paginationSettings.maxItemsOnPage,
                sortField: this.paginationSettings.sortField,
                sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
                filters: {}
            });
        });
    }

    public refresh() {
        this.domainService.getAllDomainGroups().subscribe(data => {
            this.groups = data;
        })
    }
    openRowMenu(event: Event, domainGroup: DomainGroupList) {
        this.selectedGroup = domainGroup;

        this.rowMenuItems = [
            {
                label: this.translate.instant('APPS_MANAGEMENT.EDIT_BUTTON'),
                routerLink: ['edit', domainGroup?.id]
            },
            {
                label: this.translate.instant( 'APP_INSTANCE.REMOVE_BUTTON'),
                command: () => this.deleteDomainGroup(domainGroup?.id)
            }
        ];

        this.rowMenu.toggle(event);
    }

}
