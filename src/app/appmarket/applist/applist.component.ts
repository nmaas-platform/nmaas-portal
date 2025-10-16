import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AppsService} from '../../service';
import {AppSubscriptionsService} from '../../service/appsubscriptions.service';
import {UserDataService} from '../../service/userdata.service';
import {AppViewType} from '../../shared/common/viewtype';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {distinctUntilChanged, startWith, Subscription} from 'rxjs';
import {SortService} from '../../service/sort.service';
import {SortableColumnComponent} from '../../shared/sortable-column/sortable-column.component';
import {SortableTableDirective} from '../../shared/sortable-column/sortable-table.directive';
import {AuthService} from '../../auth/auth.service';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'nmaas-applications',
    templateUrl: './applist.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    providers: [AppsService, AppSubscriptionsService, SortService, SortableTableDirective, SortableColumnComponent],
    standalone: false
})
export class AppListComponent implements OnInit, OnDestroy {

    public AppViewType = AppViewType;

    public appsView: AppViewType;
    public domainId: number;
    public selectedDomain: Subscription;

    constructor(protected userDataService: UserDataService,
                private readonly router: Router,
                private readonly route: ActivatedRoute,
                private readonly authService: AuthService,
                private readonly location: Location) {
    }

    ngOnInit(): void {
        const sessionStorageDomainId = Number(sessionStorage.getItem('selectedDomainId')) || 0;
        const defaultDomainId = this.getDefaultDomainId(sessionStorageDomainId);
        this.appsView = this.route.snapshot.data.appViewType !== undefined
            ? AppViewType.APPLICATION
            : this.route.snapshot.data.appView;
        this.userDataService.selectedDomainId
            .pipe(
                filter((domainId): domainId is number =>
                    domainId !== null
                    && domainId !== undefined
                    && domainId !== 0),
                distinctUntilChanged(),
                startWith(defaultDomainId)
            )
            .subscribe(domainId => {
                this.domainId = domainId;
                sessionStorage.setItem('selectedDomainId', String(domainId));
            });
    }

    private getDefaultDomainId(sessionStorageDomainId: number): number {
        if (sessionStorageDomainId !== 0) {
            return sessionStorageDomainId;
        }

        const domains = this.authService.getDomains();
        if (domains.length > 0) {

            const id = domains[0];
            this.userDataService.selectDomainId(id);
            return id;
        }

        return 1;
    }

    ngOnDestroy(): void {
        if (this.selectedDomain !== undefined) {
            this.selectedDomain.unsubscribe();
        }
    }
}
