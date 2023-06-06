import {AuthService} from '../../../auth/auth.service';
import {Domain} from '../../../model/domain';
import {Role} from '../../../model/userrole';
import {DomainService} from '../../../service/domain.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ModalComponent} from "../../../shared";
import {
    RemovalConfirmationModalComponent
} from "../modals/removal-confirmation-modal/removal-confirmation-modal.component";

@Component({
    selector: 'app-domains-list',
    templateUrl: './domainslist.component.html',
    styleUrls: ['./domainslist.component.css']
})
export class DomainsListComponent implements OnInit {

    public domains: Observable<Domain[]>;

    @ViewChild(RemovalConfirmationModalComponent)
    public readonly modal: ModalComponent;

    public domainToRemove: Domain

    constructor(protected domainService: DomainService, protected authService: AuthService, public translate: TranslateService) {
    }

    ngOnInit() {
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
