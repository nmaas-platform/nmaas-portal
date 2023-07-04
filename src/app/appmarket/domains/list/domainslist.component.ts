import {AuthService} from '../../../auth/auth.service';
import {Domain} from '../../../model/domain';
import {Role} from '../../../model/userrole';
import {DomainService} from '../../../service/domain.service';
import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {
    RemovalConfirmationModalComponent
} from "../modals/removal-confirmation-modal/removal-confirmation-modal.component";
import {ModalComponent} from '../../../shared';
import {SortableHeaderDirective, SortColumn, SortDirection} from '../../../service/sort-domain.directive';


export interface SortEvent {
    column: SortColumn;
    direction: SortDirection;
}

@Component({
    selector: 'app-domains-list',
    templateUrl: './domainslist.component.html',
    styleUrls: ['./domainslist.component.css']
})
export class DomainsListComponent implements OnInit {

    public readonly users_item_number_key = 'NUMBER_OF_DOMAIN_ITEM_KEY';

    public domains: Observable<Domain[]>;

    @ViewChild(RemovalConfirmationModalComponent)
    public readonly modal: ModalComponent;

    public domainToRemove: Domain

    public searchValue = '';
    p: number;

    public pageNumber = 1;
    public paginatorName = 'paginator-identifier';
    public itemsPerPage: number[] = [15, 20, 25, 30, 50];
    public maxItemsOnPage = 15;

    public showNotActive = false;

    @ViewChildren(SortableHeaderDirective)
    headers: QueryList<SortableHeaderDirective>;

    constructor(protected domainService: DomainService, protected authService: AuthService, public translate: TranslateService) {
    }

    ngOnInit() {
        const i = sessionStorage.getItem(this.users_item_number_key)
        if (i) {
            this.maxItemsOnPage = +i;
        }
        this.update();
    }

    protected getDomainsObservable(): Observable<Domain[]> {
        if (this.authService.hasRole(Role[Role.ROLE_SYSTEM_ADMIN]) || this.authService.hasRole(Role[Role.ROLE_OPERATOR])) {
            return this.domainService.getAll().pipe(
                map((domains) => domains.filter((domain) => domain.id !== this.domainService.getGlobalDomainId())));
        } else {
            return this.domainService.getMyDomains().pipe(
                map((domains) => domains.filter((domain) => this.authService.hasDomainRole(domain.id, Role[Role.ROLE_DOMAIN_ADMIN]))));
        }
    }

    public update(): void {
        this.domains = this.getDomainsObservable().pipe(
            map((domains) => [...domains].sort(
                    (a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) {
                            return -1;
                        }
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return 1;
                        }
                        return 0;
                    }
                )
            )
        )
    }

    public changeState(domain: Domain): void {
        this.domainService.updateDomainState(domain).subscribe(() => this.update());
        this.domainService.setUpdateRequiredFlag(true);
    }

    public getStateLabel(active: boolean): string {
        return active ? this.translate.instant('DOMAINS.DISABLE_BUTTON') : this.translate.instant('DOMAINS.ENABLE_BUTTON');
    }

    onSort(event: any) {
        const  sortColumn = event.sortColumn;
        const direction = event.sortDirection;
        console.warn(event)
        // resetting other headers
        this.headers.forEach((header) => {
            if (header.sortable !== sortColumn) {
                header.direction = '';
            }
        });

        this.domains = this.domains.pipe(map(value => value.sort((a, b) => {
            if (direction === 'asc') {
                if (a[sortColumn] > b[sortColumn]) {
                    return 1;
                }

                if (a[sortColumn] < b[sortColumn]) {
                    return -1;
                }
                return 0;
            } else {
                if (a[sortColumn] > b[sortColumn]) {
                    return -1;
                }

                if (a[sortColumn] < b[sortColumn]) {
                    return 1;
                }
                return 0;
            }
        } )))
        this.domains.subscribe(value => console.warn(value))
    }


    public setItems(item) {
        // store max items per page value in this session
        sessionStorage.setItem(this.users_item_number_key, item);
        this.maxItemsOnPage = item;
    }


    onSorted(event: any) {
        console.warn(event)
    }
    public softRemoveDomain(id: number): void {
        this.domainService.remove(id, true).subscribe({
            next: () => this.update(),
            error: err => console.error(err)
        });
    }

    openRemovalModal(domain: Domain) {
        this.domainToRemove = domain
        this.modal.show()
    }
}
