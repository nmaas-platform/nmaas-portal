import { AuthService } from '../../../auth/auth.service';
import { Domain } from '../../../model/domain';
import { Role } from '../../../model/userrole';
import { DomainService } from '../../../service/domain.service';
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, OnDestroy } from '@angular/core'; // Added OnDestroy
import { Observable, Subject } from 'rxjs'; // Added Subject
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Added debounceTime, distinctUntilChanged
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../../shared';
import { SortableHeaderDirective, SortColumn, SortDirection } from '../../../service/sort-domain.directive';
import { RemovalConfirmationModalComponent } from '../modals/removal-confirmation-modal/removal-confirmation-modal.component';
import { Paginator } from 'primeng/paginator';
import { Page, PaginationSettings, PrimeNgLazyLoadEvent } from '../../../service/page';


export interface SortEvent {
    column: SortColumn;
    direction: SortDirection;
}

@Component({
    selector: 'app-domains-list',
    templateUrl: './domainslist.component.html',
    styleUrls: ['./domainslist.component.css'],
    standalone: false
})
export class DomainsListComponent implements OnInit, OnDestroy { // Implemented OnDestroy

    public readonly users_item_number_key = 'NUMBER_OF_DOMAIN_ITEM_KEY';

    public loading: boolean = false;


    public domains: Domain[];

    @ViewChild(RemovalConfirmationModalComponent)
    public readonly modal: ModalComponent;

    public domainToRemove: Domain

    public searchValue = '';

    public paginationSettings: PaginationSettings = new PaginationSettings(0, 15, 1, 'id', 'asc', {}, 0);

    public showNotActive = false;

    @ViewChildren(SortableHeaderDirective)
    headers: QueryList<SortableHeaderDirective>;

    private lazyLoadSubject = new Subject<PrimeNgLazyLoadEvent>();
    private debounceTimeMs = 300; // Debounce time in milliseconds (e.g., 300ms)

    constructor(protected domainService: DomainService, protected authService: AuthService, public translate: TranslateService, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.lazyLoadSubject.pipe(
            debounceTime(this.debounceTimeMs), // Wait for debounceTimeMs after the last event
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)) // Only proceed if the event parameters have changed
        ).subscribe(event => {
            this.loadDomains(event); // Call the actual loading method
        });
    }

    ngOnDestroy(): void {
        this.lazyLoadSubject.complete(); // Complete the subject to prevent memory leaks
        this.lazyLoadSubject.unsubscribe(); // Unsubscribe from the subject
    }

    /**
     * Updates paginationSettings based on the Page object received from the backend.
     * Crucially, it does NOT update sortField, sortOrder, pageNumber, or maxItemsOnPage.
     * These properties are driven by the user interaction (PrimeNG event) and the request.
     * @param page The Page object received from the backend.
     */
    private setPaginationSettings(page: any): void {
        this.paginationSettings.totalPages = page.totalPages;
        this.paginationSettings.totalElements = page.totalElements; // Set the total number of elements
    }

    public changeState(domain: Domain): void {
        this.domainService.updateDomainState(domain).subscribe(() => this.loadDomains());
        this.domainService.setUpdateRequiredFlag(true);
    }

    public getStateLabel(active: boolean): string {
        return active ? this.translate.instant('DOMAINS.DISABLE_BUTTON') : this.translate.instant('DOMAINS.ENABLE_BUTTON');
    }

    openRemovalModal(domain: Domain) {
        this.domainToRemove = domain
        this.modal.show()
    }

    public softRemoveDomain(id: number): void {
        this.domainService.remove(id, true).subscribe({
            next: () => this.loadDomains(),
            error: err => console.error(err)
        });
    }

    /**
     * Main method for loading domains, called by PrimeNG's onLazyLoad or manually.
     * @param event The lazy load event from PrimeNG, if triggered by table.
     */
    loadDomains(event?: PrimeNgLazyLoadEvent): void {
        this.loading = true; // Start loading
        this.cdr.detectChanges(); // Manually trigger change detection for `loading` state to avoid ExpressionChangedAfterItHasBeenCheckedError

        console.log('Loading domains with event:', event);

        // Update paginationSettings based on the PrimeNG event (if provided)
        // These updates are essential and define the *request* parameters for the backend.
        if (event) {
            this.paginationSettings.maxItemsOnPage = event.rows;
            this.paginationSettings.pageNumber = (event.rows > 0) ? Math.floor(event.first / event.rows) + 1 : 1;

            // Sort field/order should always be set from event if available.
            this.paginationSettings.sortField = event.sortField || 'id'; // Default to 'id' if PrimeNG sends null/undefined
            this.paginationSettings.sortOrder = event.sortOrder === 1 ? 'asc' : (event.sortOrder === -1 ? 'desc' : 'asc'); // Default to 'asc'

            // You can also move filters from the PrimeNG event to paginationSettings.filters if you use built-in column filters
        }

        // 2. Prepare PaginatorEvent for your domainService (Spring expects 0-based page number and 1/-1 for sortOrder)
        const paginatorEventForService: PrimeNgLazyLoadEvent = {
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage, // Convert to 0-based index
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1, // Convert to 1 or -1 for backend
            filters: {} // Add filters from PrimeNG Table here if you use them
        };


        // 4. Send the request to the service
        if (this.authService.hasRole(Role[Role.ROLE_SYSTEM_ADMIN]) || this.authService.hasRole(Role[Role.ROLE_OPERATOR])) {
            this.domainService.getAllBasePageable(paginatorEventForService, this.searchValue).subscribe({ // Pass customFilters
                next: (data: Page<Domain>) => {
                    this.domains = data.content.filter((domain) => domain.id !== this.domainService.getGlobalDomainId()); // Extract data
                    this.setPaginationSettings(data); // Update pagination metadata from the backend response
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading domains', err);
                    this.loading = false;
                }
            })
        } else {
            this.domainService.getMyDomainsFiltered(paginatorEventForService, this.searchValue).subscribe({
                next: (domains: Domain[]) => {
                    this.domains = domains.filter((domain) => this.authService.hasDomainRole(domain.id, Role[Role.ROLE_DOMAIN_ADMIN]) || this.authService.hasDomainRole(domain.id, Role[Role.ROLE_GROUP_DOMAIN_ADMIN]));

                    // Reset pagination settings to reflect non-paginated state if this path is taken
                    // Ensure totalRecords is updated for PrimeNG even in non-paginated scenario
                    this.paginationSettings.totalElements = this.domains.length;
                    this.paginationSettings.pageNumber = 1;
                    this.paginationSettings.totalPages = 1;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading domains', err);
                    this.loading = false;
                }
            })
        }

    }

    // Method called directly by the onLazyLoad event from p-table
    // PrimeNG p-table emits an event that matches the PrimeNgLazyLoadEvent interface
    onTableLazyLoad(event: PrimeNgLazyLoadEvent): void {
        this.lazyLoadSubject.next(event); // Emit the event to the Subject
    }

    applyFilter(): void {
        this.paginationSettings.pageNumber = 1; // Reset to page 1 for new filter
        this.paginationSettings.totalElements = 0; // Reset total records to force re-fetch
        this.lazyLoadSubject.next({ // Emit an event to trigger loadDomains via debounce
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: { searchValue: this.searchValue } // Pass the searchValue as a filter
        });
    }

    clearFilter(): void {
        this.searchValue = '';
        this.paginationSettings.pageNumber = 1;
        this.paginationSettings.totalElements = 0; // Reset total records for a clean fetch
        this.lazyLoadSubject.next({ // Emit an event to trigger loadDomains via debounce
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: {}
        });
    }

    onSearchValueChange(event: any): void {
        if ((!this.searchValue || this.searchValue.trim() === '') ){
            this.clearFilter(); // Call clearFilter if the search field is empty
        }

    }


}
