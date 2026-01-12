import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AppsService} from '../../service';
import {AppSubscriptionsService} from '../../service/appsubscriptions.service';
import {UserDataService} from '../../service/userdata.service';
import {AppViewType} from '../../shared/common/viewtype';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {distinctUntilChanged, Subscription} from 'rxjs';
import {SortService} from '../../service/sort.service';
import {SortableColumnComponent} from '../../shared/sortable-column/sortable-column.component';
import {SortableTableDirective} from '../../shared/sortable-column/sortable-table.directive';
import {AuthService} from '../../auth/auth.service';
import {filter, tap} from 'rxjs/operators';
import {ProfileService} from '../../service/profile.service';

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
                private readonly location: Location,
                private readonly profileService: ProfileService) {
    }


    ngOnInit(): void {
        const sessionIdRaw = Number(localStorage.getItem('selectedDomainId'));
        const sessionIdIsValid = Number.isFinite(sessionIdRaw)
        const sessionId = sessionIdIsValid ? sessionIdRaw : 0;

        this.appsView = this.route.snapshot.data.appViewType === undefined
            ? this.route.snapshot.data.appView
            : AppViewType.APPLICATION;

        const seedId = this.getDefaultDomainId(sessionId);
        if (typeof seedId === 'number' && seedId > 0) {
            this.userDataService.selectDomainId(seedId);
        }
        this.userDataService.selectedDomainId
            .pipe(
                filter((id): id is number => typeof id === 'number' && id > 0),
                distinctUntilChanged(),
                tap(domainId => {
                    this.domainId = domainId;
                    localStorage.setItem('selectedDomainId', String(domainId));
                })
            )
            .subscribe();
    }

    private getDefaultDomainId(localStorageDomainId: number): number {
        if (localStorageDomainId !== 0) {
            return localStorageDomainId;
        }

        const domains = this.authService.getDomains();
        if (domains.length > 0) {
            const id = domains[0];
            this.profileService.getOne().subscribe({
                next: profile => {
                    this.userDataService.selectDomainId(profile.defaultDomain)
                    return profile.defaultDomain
                },
                error: () => {
                    this.userDataService.selectDomainId(id);
                    return id
                }
            })

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
