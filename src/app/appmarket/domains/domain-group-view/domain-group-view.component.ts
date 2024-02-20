import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomainService, UserService} from '../../../service';
import {BaseComponent} from '../../../shared/common/basecomponent/base.component';
import {ComponentMode, ModalComponent} from '../../../shared';
import {DomainGroup} from '../../../model/domaingroup';
import {Domain} from '../../../model/domain';
import {User} from '../../../model';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-domain-group-view',
    templateUrl: './domain-group-view.component.html',
    styleUrls: ['./domain-group-view.component.css']
})
export class DomainGroupViewComponent extends BaseComponent implements OnInit {

    public domainGroupId;
    public domainGroup = new DomainGroup();
    public addingMode = false;
    public domains: Domain[] = [];
    public domainsToAdd = [];
    public usersToAdd = [];
    public usersFound = [];

    public searchUser = '';

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @ViewChild('userAccess')
    public userAccessModal: ModalComponent;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private domainService: DomainService,
                private userService: UserService,
                private authService: AuthService
    ) {
        super();
    }

    ngOnInit(): void {
        this.refreshDomainForAdd();
        if (this.route.snapshot.data['mode'] === ComponentMode.CREATE) {
            console.warn('creation mode');
            this.addingMode = true;
        }
        this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.domainGroupId = +params['id'];
                this.domainService.getDomainGroup(this.domainGroupId).subscribe(
                    (domainGroup) => {
                        this.domainGroup = domainGroup;
                        this.sortApplication();
                    },
                    err => {
                        console.error(err);
                        if (err.statusCode && (err.statusCode === 404 ||
                            err.statusCode === 401 || err.statusCode === 403 || err.statusCode === 500)) {
                            this.router.navigateByUrl('/notfound');
                        }
                    })
            }
        })
    }

    submit(refresh = true) {
        console.log(this.domainGroup)
        // creation
        if (this.domainGroup.id === undefined || this.domainGroup.id === null) {
            this.domainService.createDomainGroup(this.domainGroup).subscribe(data => {
                console.warn('crated', data);
                this.router.navigate(['/admin/domains/groups/', data.id]);
            })
        } else {
            this.domainService.updateDomainGroup(this.domainGroup, this.domainGroupId).subscribe(_ => {
                if (refresh) {
                    this.refresh();
                } else {
                    this.router.navigate(['/admin/domains/groups'])
                }
            });
        }
    }

    public deleteDomainFromGroup(domain: Domain) {
        this.domainService.deleteDomainFromGroup(this.domainGroup.id, domain.id).subscribe(_ => {
            this.refresh()
            this.refreshDomainForAdd()
        })
    }

    public refresh() {
        this.domainService.getDomainGroup(this.domainGroup.id).subscribe(data => this.domainGroup = data);
    }

    public showModal(): void {
        this.filterDomainInModal();
        this.modal.show();
    }

    public filterDomainInModal() {
        const domainIds = this.domainGroup.domains.map(val => val.id);
        this.domains = this.domains.filter(value => !domainIds.includes(value.id))
    }

    public closeModal(): void {
        const domainIds = this.domainsToAdd.map(val => val.id);
        this.domainService.addDomainsToGroup(this.domainGroup.codename, domainIds).subscribe(_ => {
            this.refresh();
            this.domainsToAdd = [];
            this.refreshDomainForAdd();
        });
        this.modal.hide();
    }

    public refreshDomainForAdd(): void {
        this.domainService.getAll().subscribe(domains => {
            this.domains = domains.filter(value => value.id !== this.domainService.getGlobalDomainId());
        });
    }

    public toggleAll(): void {
        const id0 = `#collapse-${0}`;
        const el0 = document.querySelector(id0);
        if (el0) {
            if (el0.classList.contains('show')) {
                el0.classList.remove('show');
            } else {
                el0.classList.add('show');
            }
        }
        for (let j = 1; j < this.domainGroup.applicationStatePerDomain.length; j++) {
            const id = `#collapse-${j}`;
            const el = document.querySelector(id);
            if (el) {
                if (el.classList.contains('show')) {
                    el.classList.remove('show');
                } else {
                    el.classList.add('show');
                }
            }
        }
    }

    public sortApplication(): void {
        if (this.domainGroup.applicationStatePerDomain !== undefined && this.domainGroup.applicationStatePerDomain !== null) {
            this.domainGroup.applicationStatePerDomain.sort((a, b) => a.applicationBaseName.localeCompare(b.applicationBaseName))
        }
    }

    public showModalUser() {
        this.userAccessModal.show();
    }

    public deleteUserAccess(user: User) {
        this.domainGroup.managers = this.domainGroup.managers.filter(val => val.id !== user.id);
    }

    /**
     * Modal Access User functions
     */
    public searchUsers(search: string) {
        console.warn(search)
        if (search === '') {
            this.usersFound = [];
        } else {
                this.userService.getUserBySearchManagers(search ).subscribe(data => {
                    this.usersFound = [];
                    const ids = this.domainGroup.managers.flatMap(val => val.id);
                    const idsLocalAdded = this.usersToAdd.flatMap(val => val.id);
                    console.warn(ids)
                    data.forEach( user => {
                        if (!ids.includes(user.id) && !idsLocalAdded.includes(user.id)) {
                            this.usersFound.push(user);
                        }
                    })
                })
            }
    }

    public addUser(user: User) {
        this.searchUser = ''
        user.roles = [];
        user.hasSshKeys = null;
        this.usersToAdd.push({username: user.username, id: user.id, firstname: user.firstname, lastname: user.lastname});
        this.usersFound = this.usersFound.filter(val => val.id !== user.id)
    }

    public saveUsers() {
        this.domainGroup.managers.push(...this.usersToAdd);
        this.usersToAdd = [];
        this.userAccessModal.hide();
    }

   public removeUserFromSelected(user: User) {
        this.usersToAdd = this.usersToAdd.filter(val => val.id !== user.id)
    }

    public closeModalUserAccess() {
        this.userAccessModal.hide()
        this.usersToAdd = [];
        this.usersFound = [];
    }

    public removeMyAccess() {
        this.domainGroup.managers = this.domainGroup.managers.filter(user => user.username !== this.authService.getUsername())
        this.domainService.updateDomainGroup(this.domainGroup, this.domainGroupId).subscribe(_ => {
            this.router.navigate(['/admin/domains/groups'])
        })
    }

}
