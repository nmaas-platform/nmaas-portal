import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppImagesService, DomainService} from '../../service';
import {DashboardService} from '../../service/dashboard.service';
import {DomainGroupDashboardDto, GroupAppInstanceDto} from './model/domain-group-dashboard-dto';

@Component({
    selector: 'app-group-admin-dashboard',
    templateUrl: './group-admin-dashboard.component.html',
    styleUrl: './group-admin-dashboard.component.css',
    standalone: false
})
export class GroupAdminDashboardComponent implements OnInit {

    domainGroups: any[] = [];
    selectedGroup: any;
    domainAdminData: DomainGroupDashboardDto;
    groupAdminData: GroupAppInstanceDto[] = [];


    private currentLang: string;

    constructor(
        private readonly domainService: DomainService,
        private readonly dashboardService: DashboardService,
        private readonly translate: TranslateService,
        public appImagesService: AppImagesService
    ) {
    }

    ngOnInit(): void {
        this.currentLang = this.translate.getCurrentLang();


        this.domainService.getAllDomainGroups().subscribe({
            next: groups => {
                this.domainGroups = groups;
                this.selectedGroup = groups[0]
                this.getGroupAdmin()
            }
        })

    }

    public getGroupAdmin() {
        this.dashboardService.getGroupAdmin(this.selectedGroup.id).subscribe(
            (response) => {
                this.domainAdminData = response;
                this.domainAdminData?.domains.forEach(domain => {
                    console.log('domain', domain);
                    domain.applicationDeployed.forEach(application => {
                        console.log('userLogins', this.domainAdminData.userLogins);
                        const user = this.domainAdminData?.userLogins.find(
                            userDto => {
                                console.log('user.userName', userDto.userName);
                                console.log('application.userName', application.userName);
                                return userDto.userName === application.userName
                            }
                        );
                        if (user) {
                            user.deploymentCount ??= 0;
                            user.deploymentCount += application.count;
                        }
                    });
                });
                this.groupAdminData = []
                this.domainAdminData?.domains.forEach(domain => {
                    domain.applicationUpgradeStatus.forEach(application => {
                        let newInstance: GroupAppInstanceDto = application
                        newInstance.domainName = domain.name
                        this.groupAdminData.push(
                            newInstance
                        )
                    })
                })

            }
        )
    }

    public changeGroup(event: any) {
        console.log('EVENT', event);
        this.selectedGroup = event.value;
        this.getGroupAdmin();
    }

    protected formatDate(date: any): string {
        switch (this.currentLang) {
            case 'en':
                return new Date(date).toLocaleString('en-GB');
            case 'de':
                return new Date(date).toLocaleString('de-DE');
            case 'fr':
                return new Date(date).toLocaleString('fr-FR');
            case 'pl':
            default:
                return new Date(date).toLocaleString('pl-PL');
        }
    }

}













