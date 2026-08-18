import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {GroupAdminDashboardComponent} from './group-admin-dashboard.component';
import {AppImagesService, DomainService} from '../../service';
import {DashboardService} from '../../service/dashboard.service';

describe('GroupAdminDashboardComponent', () => {
    let component: GroupAdminDashboardComponent;

    let domainService: jasmine.SpyObj<DomainService>;
    let dashboardService: jasmine.SpyObj<DashboardService>;
    let translateService: jasmine.SpyObj<TranslateService>;

    beforeEach(() => {
        domainService = jasmine.createSpyObj<DomainService>(
            'DomainService',
            ['getAllDomainGroups']
        );

        dashboardService = jasmine.createSpyObj<DashboardService>(
            'DashboardService',
            ['getGroupAdmin']
        );

        translateService = jasmine.createSpyObj<TranslateService>(
            'TranslateService',
            ['getCurrentLang']
        );

        TestBed.configureTestingModule({
            providers: [
                GroupAdminDashboardComponent,
                {
                    provide: DomainService,
                    useValue: domainService
                },
                {
                    provide: DashboardService,
                    useValue: dashboardService
                },
                {
                    provide: TranslateService,
                    useValue: translateService
                },
                {
                    provide: AppImagesService,
                    useValue: {}
                }
            ]
        });

        component = TestBed.inject(GroupAdminDashboardComponent);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load domain groups on init', () => {
        const groups = [
            {id: 1, name: 'Group 1'}
        ];

        translateService.getCurrentLang.and.returnValue('pl');

        domainService.getAllDomainGroups.and.returnValue(
            of(groups as any)
        );

        dashboardService.getGroupAdmin.and.returnValue(
            of({
                userLogins: [],
                domains: []
            } as any)
        );

        component.ngOnInit();

        expect(component.domainGroups).toEqual(groups);
        expect(component.selectedGroup).toEqual(groups[0]);
        expect(dashboardService.getGroupAdmin).toHaveBeenCalledWith(1);
    });

    it('should change selected group', () => {
        const group = {
            id: 2,
            name: 'Group 2'
        };

        dashboardService.getGroupAdmin.and.returnValue(
            of({
                userLogins: [],
                domains: []
            } as any)
        );

        component.changeGroup({
            value: group
        });

        expect(component.selectedGroup).toEqual(group);
        expect(dashboardService.getGroupAdmin).toHaveBeenCalledWith(2);
    });

    it('should calculate deployment count for user', () => {
        component.selectedGroup = {
            id: 1
        };

        dashboardService.getGroupAdmin.and.returnValue(
            of({
                userLogins: [
                    {
                        userName: 'john',
                        deploymentCount: 0
                    }
                ],
                domains: [
                    {
                        name: 'domain-1',
                        applicationDeployed: [
                            {
                                userName: 'john',
                                count: 3
                            }
                        ],
                        applicationUpgradeStatus: []
                    }
                ]
            } as any)
        );

        component.getGroupAdmin();

        expect(component.domainAdminData.userLogins[0].deploymentCount)
            .toBe(3);
    });

    it('should add deployment count to existing value', () => {
        component.selectedGroup = {
            id: 1
        };

        dashboardService.getGroupAdmin.and.returnValue(
            of({
                userLogins: [
                    {
                        userName: 'john',
                        deploymentCount: 2
                    }
                ],
                domains: [
                    {
                        name: 'domain-1',
                        applicationDeployed: [
                            {
                                userName: 'john',
                                count: 3
                            }
                        ],
                        applicationUpgradeStatus: []
                    }
                ]
            } as any)
        );

        component.getGroupAdmin();

        expect(component.domainAdminData.userLogins[0].deploymentCount)
            .toBe(5);
    });

    it('should not update deployment count when user does not match', () => {
        component.selectedGroup = {
            id: 1
        };

        dashboardService.getGroupAdmin.and.returnValue(
            of({
                userLogins: [
                    {
                        userName: 'john',
                        deploymentCount: 0
                    }
                ],
                domains: [
                    {
                        name: 'domain-1',
                        applicationDeployed: [
                            {
                                userName: 'anna',
                                count: 3
                            }
                        ],
                        applicationUpgradeStatus: []
                    }
                ]
            } as any)
        );

        component.getGroupAdmin();

        expect(component.domainAdminData.userLogins[0].deploymentCount)
            .toBe(0);
    });

    it('should create group admin data with domain name', () => {
        component.selectedGroup = {
            id: 1
        };

        dashboardService.getGroupAdmin.and.returnValue(
            of({
                userLogins: [],
                domains: [
                    {
                        name: 'domain-1',
                        applicationDeployed: [],
                        applicationUpgradeStatus: [
                            {
                                applicationName: 'App 1'
                            }
                        ]
                    }
                ]
            } as any)
        );

        component.getGroupAdmin();

        expect(component.groupAdminData.length).toBe(1);
        expect(component.groupAdminData[0].domainName).toBe('domain-1');
    });

    it('should create group admin data from multiple domains', () => {
        component.selectedGroup = {
            id: 1
        };

        dashboardService.getGroupAdmin.and.returnValue(
            of({
                userLogins: [],
                domains: [
                    {
                        name: 'domain-1',
                        applicationDeployed: [],
                        applicationUpgradeStatus: [
                            {
                                applicationName: 'App 1'
                            }
                        ]
                    },
                    {
                        name: 'domain-2',
                        applicationDeployed: [],
                        applicationUpgradeStatus: [
                            {
                                applicationName: 'App 2'
                            }
                        ]
                    }
                ]
            } as any)
        );

        component.getGroupAdmin();

        expect(component.groupAdminData.length).toBe(2);
        expect(component.groupAdminData[0].domainName).toBe('domain-1');
        expect(component.groupAdminData[1].domainName).toBe('domain-2');
    });
});
