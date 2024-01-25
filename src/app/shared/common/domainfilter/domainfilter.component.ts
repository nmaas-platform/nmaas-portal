import {AuthService} from '../../../auth/auth.service';
import {Domain} from '../../../model/domain';
import {DomainService} from '../../../service';
import {UserDataService} from '../../../service/userdata.service';
import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, interval, Observable, of, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProfileService} from '../../../service/profile.service';
import {User} from '../../../model';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'nmaas-domain-filter',
    templateUrl: './domainfilter.component.html',
    styleUrls: ['./domainfilter.component.css'],
})
export class DomainFilterComponent implements OnInit {

    public domainId: number;

    public domainName: string;

    public domainsObs: Observable<Domain[]>;

    public domains: Domain[];

    public refresh: Subscription;

    public profile: User;

    public searchTerm = '';

    private filteredDomainsSub = new BehaviorSubject<any[]>([]);


    constructor(private authService: AuthService,
                private domainService: DomainService,
                private userData: UserDataService,
                private profileService: ProfileService,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        if (this.authService.hasRole('ROLE_SYSTEM_ADMIN')) {
            this.refresh = interval(10000).subscribe(next => {
                if (this.domainService.shouldUpdate()) {
                    this.updateDomains();
                    this.domainService.setUpdateRequiredFlag(false);
                }
            });
        }
        this.profileService.getOne().subscribe(
            profile => {
                this.profile = profile;

                this.updateDomains();
                this.domainsObs.subscribe(domain => {
                    this.domainName = domain[0].name;
                    this.userData.selectDomainId(domain[0].id)
                    this.filteredDomainsSub.next(domain);
                    this.domains = domain
                });
            }
        );

        this.userData.selectedDomainId.subscribe(id => this.domainId = id);
    }

    public updateFilter() {
        this.domainsObs.subscribe(data => {
            const filtered = data.filter(obj => obj.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
            this.filteredDomainsSub.next(filtered);
        });
    }

    public updateDomains(): void {
        if (this.authService.hasRole('ROLE_SYSTEM_ADMIN')) {
            this.domainsObs = this.domainService.getAll();
        } else {
            this.domainsObs = this.domainService.getMyDomains();
            const globalDomainId = this.domainService.getGlobalDomainId();
            if (this.domainsObs === undefined) {
                this.domainsObs = of([]);
            }
            if (!this.authService.hasDomainRole(globalDomainId, 'ROLE_TOOL_MANAGER')
                && !this.authService.hasDomainRole(globalDomainId, 'ROLE_OPERATOR')) {
                this.filterOutGlobalDomain();
                this.filterOutNotActiveDomains();
            }
        }
        this.sortDomains();
    }

    private filterOutNotActiveDomains(): void {
        this.domainsObs = this.domainsObs.pipe(
            map(
                (domains) => domains.filter(domain => domain.active)
            )
        );
    }

    private filterOutGlobalDomain(): void {
        const globalDomainId = this.domainService.getGlobalDomainId();
        this.domainsObs = this.domainsObs.pipe(
            map(
                (domains) => domains.filter(domain => domain.id !== globalDomainId)
            )
        );
    }

    private sortDomains(): void {
        const globalDomainId = this.domainService.getGlobalDomainId();
        this.domainsObs = this.domainsObs.pipe(
            map(
                domains => {
                    const global = domains.find(domain => domain.id === globalDomainId);
                    const defaultDomain = domains.find(domain => domain.id === this.profile.defaultDomain);
                    domains = domains.filter(domain => domain.id !== globalDomainId && domain.id !== this.profile.defaultDomain);

                    domains.sort((a: Domain, b: Domain): number => {
                        return a.name.localeCompare(b.name)
                    })
                    if (global !== undefined) {
                        domains.unshift(global)
                    }
                    if (defaultDomain !== undefined && this.profile.defaultDomain !== globalDomainId) {
                        domains.unshift(defaultDomain)
                    }
                    return domains
                }
            )
        )
    }

    public changeDomain(event: any) {
        console.log(`domainChange(${event.value.id})`);
        this.domainId = event.value.id;
        this.domainName = event.value.name;
        this.userData.selectDomainId(Number(event.value.id));
    }

    public getCurrent() {
        return `${this.translateService.instant('FILTER.DOMAIN')} : ${this.domainName}`;
    }

    isItemListLong() {
        return this.domains.length > 10;
    }
}
