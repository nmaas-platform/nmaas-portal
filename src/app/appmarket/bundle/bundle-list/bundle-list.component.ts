import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Bundle} from '../../../model/bundle';
import {Page, PaginationSettings, PrimeNgLazyLoadEvent} from '../../../service/page';
import {Subject} from 'rxjs';
import {Domain} from '../../../model/domain';
import {MenuItem} from 'primeng/api';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {AuthService} from '../../../auth/auth.service';
import {Role} from '../../../model/userrole';
import {BundleService} from '../../../service/bundle.service';
import {BundleBasic} from '../../../model/bundle-basic';
import {BundleDescription} from "../../../model/bundle-description";
import {TranslateService} from "@ngx-translate/core";
import {MonitorEntry} from "../../../model/monitorentry";
import {Menu} from "primeng/menu";

@Component({
    selector: 'app-bundle-list',
    templateUrl: './bundle-list.component.html',
    styleUrl: './bundle-list.component.css',
    standalone: false
})
export class BundleListComponent implements OnInit, OnDestroy {

    @ViewChild('rowMenu') rowMenu!: Menu;
    rowMenuItems: MenuItem[] = [];

    private readonly debounceTimeMs = 300;

    private readonly lazyLoadSubject = new Subject<PrimeNgLazyLoadEvent>();
    protected paginationSettings: PaginationSettings = new PaginationSettings(0, 15, 1, 'id', 'asc', {}, 0);
    protected loading: boolean = false;

    protected searchValue = '';
    protected bundles: BundleBasic[]

    public bundle: Bundle;

    constructor(private readonly bundleService: BundleService,
                private readonly cdr: ChangeDetectorRef,
                public translate: TranslateService,
                private readonly authService: AuthService
    ) {
    }

    ngOnInit() {
        this.lazyLoadSubject.pipe(
            debounceTime(this.debounceTimeMs),
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
        ).subscribe((event: PrimeNgLazyLoadEvent) => {
            this.loadBundles(event);
        });
    }
    ngOnDestroy() {
        this.lazyLoadSubject.complete();
        this.lazyLoadSubject.unsubscribe();
    }

    private loadBundles(event?: PrimeNgLazyLoadEvent) {
        this.loading = true;
        this.cdr.detectChanges();

        if (event) {
            this.paginationSettings.maxItemsOnPage = event.rows;
            this.paginationSettings.pageNumber = event.first / event.rows + 1;
            this.paginationSettings.sortField = event.sortField || 'id';
            this.paginationSettings.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
        }
        console.debug('loadBundles', this.paginationSettings);

        const paginatorEventForService: PrimeNgLazyLoadEvent = {
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: {}
        }
        if (this.hasPrivileges()) {
            this.bundleService.getAll(
                // this.paginationSettings.pageNumber,
                0,
                this.paginationSettings.maxItemsOnPage,
                this.paginationSettings.sortField +
                this.paginationSettings.sortOrder === 'asc' ? ',asc' : ',desc',
                this.searchValue
                ).subscribe({
                next:(data: Page<BundleBasic>) => {
                    this.bundles = data.content;
                    this.setPaginationSettings(data);
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading bundles', err);
                    this.loading = false;
                }
                }
            );
        } else {
            console.debug('No privileges to view bundles');
        }
    }

    private hasPrivileges(): boolean {
        return this.authService.hasRole(
                Role[Role.ROLE_SYSTEM_ADMIN])
            || this.authService.hasRole(Role[Role.ROLE_OPERATOR])
            || this.authService.hasRole(Role[Role.ROLE_GROUP_MANAGER]
            );
    }
    private setPaginationSettings(page: any): void {
        this.paginationSettings.totalPages = page.totalPages;
        this.paginationSettings.totalElements = page.totalElements;
    }

    protected onTableLazyLoad(event: PrimeNgLazyLoadEvent): void {
        this.lazyLoadSubject.next(event);
    }

    protected onSearchValueChange(event: any): void {
    }

    protected applyFilter(): void {
        this.paginationSettings.pageNumber = 1;
        this.paginationSettings.totalElements = 0;
        this.lazyLoadSubject.next({
          first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
          rows: this.paginationSettings.maxItemsOnPage,
          sortField: this.paginationSettings.sortField,
          sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
          filters: { searchValue: this.searchValue }
        });
    }

    getDescription(bundle: BundleBasic): BundleDescription | undefined {
        return bundle.descriptions?.find(d => d.language === this.translate.currentLang);
    }

    openRowMenu(event: Event, bundle: Bundle) {

        this.rowMenuItems = [
            {
                label:this.translate.instant( 'BUNDLES.EDIT'),
                routerLink: ['edit', bundle.id]
            }
        ];

        this.rowMenu.toggle(event);
    }

}
