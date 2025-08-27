import {Component, OnInit} from '@angular/core';

import {AppInstance, AppInstanceState} from '../../../model';
import {
    AppConfigService,
    AppImagesService,
    AppInstanceService,
    AppsService,
    CustomerSearchCriteria,
    CustomPageCriteria,
    DomainService
} from '../../../service';
import {AuthService} from '../../../auth/auth.service';
import {UserDataService} from '../../../service/userdata.service';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {SessionService} from '../../../service/session.service';

export enum AppInstanceListSelection {
    ALL, MY,
}

@Component({
    selector: 'nmaas-appinstancelist',
    templateUrl: './appinstancelist.component.html',
    styleUrls: ['./appinstancelist.component.css'],
    standalone: false
})
export class AppInstanceListComponent implements OnInit {

    appDeployedInstances: AppInstance[] = [];
    appUndeployedInstances: AppInstance[] = [];
    allAppUndeployedInstances: Observable<AppInstance[]>;
    allAppDeployedInstances: Observable<AppInstance[]>;
    totalElements = 0;
    loadingInstances = false;
    loadingUndeployedInstances = false;

    public isUndeployedVisible = false;
    public isOnlyMyVisible = false;

    private readonly item_number_key: string = 'item_number_per_page';
    private readonly list_selection_key: string = 'list_selection';

    public maxItemsOnPage = 10;
    public maxItemsOnPageSec = 10;

    public pageNumber = 1;
    public secondPageNumber = 1;

    public appInstanceState: typeof AppInstanceState = AppInstanceState;

    public domainId = 2;
    public viewOptions = [
        {icon: 'pi pi-list', value: 'list'},
        {icon: 'pi pi-th-large', value: 'cards'}
    ];
    public selectedViewType = 'cards';
    public selectedListRange: AppInstanceListSelection = AppInstanceListSelection.ALL;


    public searchValue = '';


    constructor(private readonly appInstanceService: AppInstanceService,
                protected readonly domainService: DomainService,
                private readonly userDataService: UserDataService,
                private readonly authService: AuthService,
                private readonly translateService: TranslateService,
                private readonly sessionService: SessionService,
                protected readonly appImagesService: AppImagesService) {

    }

    ngOnInit() {
        this.userDataService.selectedDomainId.subscribe(domainId => {
            if (this.authService.hasDomainRole(domainId, 'ROLE_USER') ||
                this.authService.hasDomainRole(domainId, 'ROLE_GUEST') ||
                domainId == null) {
                this.selectedListRange = AppInstanceListSelection.ALL;
            }
            this.allAppDeployedInstances = this.appInstanceService.getSortedAppInstances(
                this.domainId,
                new CustomerSearchCriteria('id', 'desc', 'deployed'))
            this.domainId = domainId
            this.reloadDeployedInstances()
            this.reloadUndeployedInstances()
        });

        this.sessionService.registerCulture(this.translateService.currentLang);
        const i = sessionStorage.getItem(this.item_number_key);
        if (i) {
            this.maxItemsOnPage = +i;
            this.maxItemsOnPageSec = +i;
        }
    }

    public checkPrivileges(app) {
        return app.owner.username === this.authService.getUsername()
            || this.authService.hasRole('ROLE_SYSTEM_ADMIN')
            || this.authService.hasDomainRole(app.domainId, 'ROLE_DOMAIN_ADMIN')
            || this.authService.hasDomainRole(app.domainId, 'ROLE_USER');
    }

    public onSearch() {
        this.reloadDeployedInstances();
        if (this.isUndeployedVisible) {
            this.reloadUndeployedInstances();
        }
    }

    public onOnlyMyVisibleChange() {
        this.selectedListRange = this.isOnlyMyVisible
            ? AppInstanceListSelection.MY
            : AppInstanceListSelection.ALL;

        sessionStorage.setItem(this.list_selection_key, AppInstanceListSelection[this.selectedListRange]);
        this.reloadDeployedInstances();
        if (this.isUndeployedVisible) {
            this.reloadUndeployedInstances();
        }
    }

    public onUndeployVisibleChange() {
        if (this.isUndeployedVisible) {
            this.reloadUndeployedInstances()
        }

    }

    public translateState(appState): string {
        let outputString = '';
        this.translateService.get('ENUM.' + appState.toString()).subscribe((res: string) => {
            outputString = res;
        });
        return outputString;
    }

    protected userHasGuestRoleInCurrentDomain(): boolean {
        return this.authService.hasDomainRole(this.domainId, 'ROLE_GUEST');
    }

    protected getStateAsEnum(state: string | AppInstanceState): AppInstanceState {
        return typeof state === 'string' ? AppInstanceState[state] : state;
    }

    protected loadInstancesLazy(event: any) {
        this.loadingInstances = true;
        const page = event.first / event.rows;  // np. first=0, rows=10 → page=0
        const size = event.rows;
        const criteria = new CustomPageCriteria(page, size, 'id', 'desc', 'deployed')
        if (this.searchValue !== '') {
            criteria.search = this.searchValue
        }
        if (this.selectedListRange === AppInstanceListSelection.MY) {
            this.appInstanceService.getPagedMyAppInstances(this.domainId, criteria).subscribe(response => {
                this.appDeployedInstances = response.content;
                this.totalElements = response.totalElements;
                this.loadingInstances = false;
            });
        } else if (this.selectedListRange === AppInstanceListSelection.ALL) {
            this.appInstanceService.getPagedAppInstances(this.domainId, criteria).subscribe(response => {
                this.appDeployedInstances = response.content;
                this.totalElements = response.totalElements;
                this.loadingInstances = false;
            });
        }


    }

    protected loadUndeployedInstancesLazy(event: any) {
        this.loadingUndeployedInstances = true;
        const page = event.first / event.rows;  // np. first=0, rows=10 → page=0
        const size = event.rows;
        const criteria = new CustomPageCriteria(page, size, 'id', 'desc', `undeployed`)
        if (this.searchValue !== '') {
            criteria.search = this.searchValue
        }
        this.appInstanceService.getPagedAppInstances(this.domainId, criteria).subscribe(response => {
            this.appUndeployedInstances = response.content;
            this.totalElements = response.totalElements;
            this.loadingUndeployedInstances = false;
        });
    }

    private reloadDeployedInstances() {
        if (this.selectedViewType === 'cards') {
            this.allAppDeployedInstances = this.isOnlyMyVisible ?
                this.getSortedMyInstances('deployed')
                : this.getSortedInstances('deployed');
        } else if (this.selectedViewType === 'list') {
            this.loadInstancesLazy({first: 0, rows: 10})
        }
    }

    private reloadUndeployedInstances() {
        if (this.selectedViewType === 'cards') {
            this.allAppUndeployedInstances = this.isOnlyMyVisible ?
                this.getSortedMyInstances('undeployed')
                : this.getSortedInstances('undeployed');
        } else if (this.selectedViewType === 'list') {
            this.loadUndeployedInstancesLazy({first: 0, rows: 10})
        }
    }

    private getSortedMyInstances(status: string) {
        return this.appInstanceService.getSortedMyAppInstances(
            this.domainId,
            new CustomerSearchCriteria('id', 'desc', status))
    }

    private getSortedInstances(status: string) {
        return this.appInstanceService.getSortedAppInstances(
            this.domainId,
            new CustomerSearchCriteria('id', 'desc', status))
    }
}
