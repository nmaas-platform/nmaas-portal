import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {DomainGroupViewComponent} from './domain-group-view.component';
import {RouterTestingModule} from '@angular/router/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {DomainService, UserService} from '../../../service';
import {AuthService} from '../../../auth/auth.service';
import {ProfileService} from '../../../service/profile.service';
import {ModalComponent} from '../../../shared';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {DomainGroup} from '../../../model/domaingroup';
import {Domain} from '../../../model/domain';
import {User} from '../../../model/user';
import {Role} from '../../../model/userrole';
import {ActivatedRoute, Router} from '@angular/router';
import {DomainApplicationStatePerDomain} from '../../../model/domainapplicationstateperdomain';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ToastContainerComponent} from '../../../shared/toast-container/toast-container.component';
import {MessageService} from 'primeng/api';
import any = jasmine.any;

describe('DomainGroupViewComponent', () => {
    let component: DomainGroupViewComponent;
    let fixture: ComponentFixture<DomainGroupViewComponent>;
    let mockDomainService: jasmine.SpyObj<DomainService>;
    let mockUserService: jasmine.SpyObj<UserService>;
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockProfileService: jasmine.SpyObj<ProfileService>;
    let mockModal: jasmine.SpyObj<ModalComponent>;
    let mockActivatedRoute: any;
    let mockRouter: jasmine.SpyObj<Router>;



    beforeEach(async () => {
        mockDomainService = jasmine.createSpyObj('DomainService', [
            'getDomainGroup',
            'createDomainGroup',
            'updateDomainGroup',
            'deleteDomainFromGroup',
            'getAll',
            'addDomainsToGroup',
            'updateDomainGroupManagers',
            'getGlobalDomainId',
        ]);
        mockDomainService.getAll.and.returnValue(of([])); // Mock getAll to return an empty array
        mockDomainService.getGlobalDomainId.and.returnValue(0); // Mock getGlobalDomainId
        mockDomainService.getDomainGroup.and.returnValue(of({
            id: 0,
            name: '',
            codename: '',
            domains: [],
            applicationStatePerDomain: [],
            managers: []
        } as DomainGroup)); // Mock getDomainGroup to return a valid DomainGroup object

        mockUserService = jasmine.createSpyObj('UserService', ['getUserBySearchManagers']);
        mockAuthService = jasmine.createSpyObj('AuthService', ['getUsername', 'loadUser']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockProfileService = jasmine.createSpyObj('ProfileService', ['getOne']);
        mockModal = jasmine.createSpyObj('ModalComponent', ['show', 'hide']);
        // mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);
        // mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
        mockActivatedRoute = {
            snapshot: {data: {mode: 'VIEW'}},
            params: of({id: 1}) // Mock route parameters
        };

        await TestBed.configureTestingModule({
            declarations: [DomainGroupViewComponent, ModalComponent,ToastContainerComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    },
                })],
            providers: [
                {provide: DomainService, useValue: mockDomainService},
                {provide: UserService, useValue: mockUserService},
                {provide: AuthService, useValue: mockAuthService},
                {provide: Router, useValue: mockRouter},
                {provide: ProfileService, useValue: mockProfileService},
                {provide: ActivatedRoute, useValue: mockActivatedRoute}, // Provide mocked ActivatedRoute
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                MessageService
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DomainGroupViewComponent);
        component = fixture.componentInstance;
        component.userAccessModal = mockModal; // Assign mocked user access modal
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize and fetch domain group data based on route params', () => {
        const mockDomainGroup: DomainGroup = {
            id: 1,
            name: 'Test Group',
            codename: 'test-group',
            domains: [],
            applicationStatePerDomain: [],
            managers: []
        };
        mockDomainService.getDomainGroup.and.returnValue(of(mockDomainGroup));

        component.ngOnInit();

        expect(mockDomainService.getDomainGroup).toHaveBeenCalledWith(1);
        expect(component.domainGroup).toEqual(mockDomainGroup);
    });

    it('should initialize and fetch domain group data', () => {
        const mockDomainGroup: DomainGroup = {
            id: 1,
            name: 'Test Group',
            codename: 'test-group',
            domains: [],
            applicationStatePerDomain: [],
            managers: []
        };
        mockDomainService.getDomainGroup.and.returnValue(of(mockDomainGroup));

        component.domainGroupId = 1;
        component.refresh();

        expect(mockDomainService.getDomainGroup).toHaveBeenCalledWith(1);
        expect(component.domainGroup).toEqual(mockDomainGroup);
    });

    it('should show modal and filter domains', () => {
        component.domains = [{id: 1} as Domain, {id: 2} as Domain];
        component.domainGroup.domains = [{id: 1} as Domain];

        spyOn(component.modal, 'show');

        component.showModal();

        expect(component.modal.show).toHaveBeenCalled();
        expect(component.domains).toEqual([{id: 2} as Domain]);
    });

    it('should close modal and add domains to group', () => {
        component.domainsToAdd = [{id: 1} as Domain];
        mockDomainService.addDomainsToGroup.and.returnValue(of(null));
        spyOn(component.modal, 'hide');

        component.closeModal();

        expect(mockDomainService.addDomainsToGroup).toHaveBeenCalledWith(component.domainGroup.codename, [1]);
        expect(component.modal.hide).toHaveBeenCalled();
    });

    it('should delete a domain from the group', () => {
        mockDomainService.deleteDomainFromGroup.and.returnValue(of(null));
        spyOn(component, 'refresh');

        component.domainGroup.id = 1;
        component.deleteDomainFromGroup({id: 2} as Domain);

        expect(mockDomainService.deleteDomainFromGroup).toHaveBeenCalledWith(1, 2);
        expect(component.refresh).toHaveBeenCalled();
    });

    it('should search and filter users for adding', () => {
        const mockUsers: User[] = [
            {
                id: 1,
                username: 'user1',
                enabled: true,
                firstname: 'User',
                lastname: 'One',
                email: 'user1@example.com',
                roles: [],
                termsOfUseAccepted: true,
                privacyPolicyAccepted: true,
                ssoUser: false,
                selectedLanguage: 'en',
                defaultDomain: 1,
                lastSuccessfulLoginDate: new Date(),
                firstLoginDate: new Date(),
                sshKeys: [],
                hasSshKeys: false,
                getRoles(): Role[] {
                    return [];
                },
                getDomainIds(): number[] {
                    return [];
                },
            },
            {
                id: 2,
                username: 'user2',
                enabled: true,
                firstname: 'User',
                lastname: 'Two',
                email: 'user2@example.com',
                roles: [],
                termsOfUseAccepted: true,
                privacyPolicyAccepted: true,
                ssoUser: false,
                selectedLanguage: 'en',
                defaultDomain: 1,
                lastSuccessfulLoginDate: new Date(),
                firstLoginDate: new Date(),
                sshKeys: [],
                hasSshKeys: false,
                getRoles(): Role[] {
                    return [];
                },
                getDomainIds(): number[] {
                    return [];
                },
            },
        ];
        mockUserService.getUserBySearchManagers.and.returnValue(of(mockUsers));
        component.domainGroup.managers = [{id: 1} as User];

        component.searchUsers('user');

        expect(mockUserService.getUserBySearchManagers).toHaveBeenCalledWith('user');
        expect(component.usersFound).toEqual([mockUsers[1]]);
    });

    it('should add a user to the group', () => {
        const mockUser: User = {
            id: 1,
            username: 'user1',
            enabled: true,
            firstname: 'User',
            lastname: 'One',
            email: 'user1@example.com',
            roles: [],
            termsOfUseAccepted: true,
            privacyPolicyAccepted: true,
            ssoUser: false,
            selectedLanguage: 'en',
            defaultDomain: 1,
            lastSuccessfulLoginDate: new Date(),
            firstLoginDate: new Date(),
            sshKeys: [],
            hasSshKeys: false,
            getRoles(): Role[] {
                return [];
            },
            getDomainIds(): number[] {
                return [];
            },
        };
        component.usersToAdd = [];
        component.usersFound = [mockUser];

        component.addUser(mockUser);

        expect(component.usersToAdd).toContain(jasmine.objectContaining({
            id: mockUser.id,
            username: mockUser.username,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname
        }));
        expect(component.usersFound).not.toContain(mockUser);
    });

    it('should save users and update managers', () => {
        const mockUser: User = {
            id: 1,
            username: 'user1',
            enabled: true,
            firstname: 'User',
            lastname: 'One',
            email: 'user1@example.com',
            roles: [],
            termsOfUseAccepted: true,
            privacyPolicyAccepted: true,
            ssoUser: false,
            selectedLanguage: 'en',
            defaultDomain: 1,
            lastSuccessfulLoginDate: new Date(),
            firstLoginDate: new Date(),
            sshKeys: [],
            hasSshKeys: false,
            getRoles(): Role[] {
                return [];
            },
            getDomainIds(): number[] {
                return [];
            },
        };
        component.usersToAdd = [mockUser];
        component.domainGroup.managers = [];
        mockDomainService.updateDomainGroupManagers.and.returnValue(of({
            id: component.domainGroupId,
            name: 'Test Group',
            codename: 'test-group',
            domains: [],
            applicationStatePerDomain: [],
            managers: [mockUser]
        }));
        spyOn(component.userAccessModal, 'hide');

        component.saveUsers();

        expect(mockDomainService.updateDomainGroupManagers).toHaveBeenCalledWith([mockUser], component.domainGroupId);
        expect(component.userAccessModal.hide).toHaveBeenCalled();
    });

    it('should remove user access from the group', () => {
        const mockUser: User = {
            id: 1,
            username: 'user1',
            enabled: true,
            firstname: 'User',
            lastname: 'One',
            email: 'user1@example.com',
            roles: [],
            termsOfUseAccepted: true,
            privacyPolicyAccepted: true,
            ssoUser: false,
            selectedLanguage: 'en',
            defaultDomain: 1,
            lastSuccessfulLoginDate: new Date(),
            firstLoginDate: new Date(),
            sshKeys: [],
            hasSshKeys: false,
            getRoles(): Role[] {
                return [];
            },
            getDomainIds(): number[] {
                return []
            },
        };
        component.domainGroup.managers = [mockUser];
        mockDomainService.updateDomainGroupManagers.and.returnValue(of({
            id: component.domainGroupId,
            name: 'Test Group',
            codename: 'test-group',
            domains: [],
            applicationStatePerDomain: [],
            managers: []
        }));

        component.deleteUserAccess(mockUser);

        expect(mockDomainService.updateDomainGroupManagers).toHaveBeenCalledWith([], component.domainGroupId);
        expect(component.domainGroup.managers).toEqual([]);
    });

    it('should toggle all application states', () => {
        const mockApplicationState: DomainApplicationStatePerDomain[] = [
            {applicationBaseId: 1, applicationBaseName: 'App1', enabled: true, pvStorageSizeLimit: 100},
            {applicationBaseId: 2, applicationBaseName: 'App2', enabled: false, pvStorageSizeLimit: 200}
        ];
        component.domainGroup.applicationStatePerDomain = mockApplicationState;

        const mockElement = document.createElement('div');
        mockElement.classList.add('show');
        spyOn(document, 'querySelector').and.returnValue(mockElement);

        component.toggleAll();

        expect(mockElement.classList.contains('show')).toBeTruthy();
    });

    it('should sort applications by name', () => {
        component.domainGroup.applicationStatePerDomain = [
            {applicationBaseId: 3, applicationBaseName: 'Zebra', enabled: true, pvStorageSizeLimit: 300},
            {applicationBaseId: 1, applicationBaseName: 'Apple', enabled: true, pvStorageSizeLimit: 100},
            {applicationBaseId: 2, applicationBaseName: 'Mango', enabled: false, pvStorageSizeLimit: 200}
        ];

        component.sortApplication();

        expect(component.domainGroup.applicationStatePerDomain).toEqual([
            {applicationBaseId: 1, applicationBaseName: 'Apple', enabled: true, pvStorageSizeLimit: 100},
            {applicationBaseId: 2, applicationBaseName: 'Mango', enabled: false, pvStorageSizeLimit: 200},
            {applicationBaseId: 3, applicationBaseName: 'Zebra', enabled: true, pvStorageSizeLimit: 300}
        ]);
    });

    it('should handle domain group creation', () => {
        const mockOwner = {id: 1, username: 'owner'} as User;
        const mockCreatedGroup = {id: 2, name: 'New Group'} as DomainGroup;
        mockProfileService.getOne.and.returnValue(of(mockOwner));
        mockDomainService.createDomainGroup.and.returnValue(of(mockCreatedGroup));

        component.domainGroup = new DomainGroup();
        component.submit();

        expect(mockProfileService.getOne).toHaveBeenCalled();
        expect(mockDomainService.createDomainGroup).toHaveBeenCalledWith(jasmine.objectContaining({
            managers: [mockOwner]
        }));
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/domains/groups/', mockCreatedGroup.id]);
    });

    it('should handle domain group update', () => {
        const mockUpdatedGroup = {id: 1, name: 'Updated Group'} as DomainGroup;
        mockDomainService.updateDomainGroup.and.returnValue(of(mockUpdatedGroup));
        mockAuthService.loadUser.and.stub();
        spyOn(component, 'refresh');

        component.domainGroup = mockUpdatedGroup;
        component.domainGroupId = 1;
        component.submit();

        expect(mockDomainService.updateDomainGroup).toHaveBeenCalledWith(mockUpdatedGroup, 1);
        expect(component.refresh).toHaveBeenCalled();
    });

    it('should handle domain group update and navigate away', () => {
        const mockUpdatedGroup = {id: 1, name: 'Updated Group'} as DomainGroup;
        mockDomainService.updateDomainGroup.and.returnValue(of(mockUpdatedGroup));

        component.domainGroup = mockUpdatedGroup;
        component.domainGroupId = 1;
        component.submit(false);

        expect(mockDomainService.updateDomainGroup).toHaveBeenCalledWith(mockUpdatedGroup, 1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/domains/groups']);
    });

    it('should remove user from selected users to add', () => {
        const mockUser: User = {id: 1, username: 'user1'} as User;
        component.usersToAdd = [mockUser];

        component.removeUserFromSelected(mockUser);

        expect(component.usersToAdd).not.toContain(mockUser);
    });

    it('should close user access modal and reset users', () => {
        spyOn(component.userAccessModal, 'hide');
        component.usersToAdd = [{id: 1, username: 'user1'} as User];
        component.usersFound = [{id: 2, username: 'user2'} as User];

        component.closeModalUserAccess();

        expect(component.userAccessModal.hide).toHaveBeenCalled();
        expect(component.usersToAdd).toEqual([]);
        expect(component.usersFound).toEqual([]);
    });

    it('should remove current user access and navigate away', () => {
        const mockUsername = 'currentUser';
        mockAuthService.getUsername.and.returnValue(mockUsername);
        mockDomainService.updateDomainGroup.and.returnValue(of(null));

        component.domainGroup.managers = [
            {
                id: 1,
                username: 'currentUser',
                enabled: true,
                firstname: '',
                lastname: '',
                email: '',
                roles: [],
                termsOfUseAccepted: true,
                privacyPolicyAccepted: true,
                ssoUser: false,
                selectedLanguage: 'en',
                defaultDomain: 1,
                lastSuccessfulLoginDate: new Date(),
                firstLoginDate: new Date(),
                sshKeys: [],
                hasSshKeys: false,
                getRoles(): Role[] {
                    return [];
                },
                getDomainIds(): number[] {
                    return [];
                }
            },
            {
                id: 2,
                username: 'otherUser',
                enabled: true,
                firstname: '',
                lastname: '',
                email: '',
                roles: [],
                termsOfUseAccepted: true,
                privacyPolicyAccepted: true,
                ssoUser: false,
                selectedLanguage: 'en',
                defaultDomain: 1,
                sshKeys: [],
                hasSshKeys: false,
            } as User
        ];
        component.domainGroupId = 1;

        component.removeMyAccess();

        expect(component.domainGroup.managers).toEqual([{
            id: 2,
            username: 'otherUser',
            enabled: true,
            firstname: '',
            lastname: '',
            email: '',
            roles: [],
            termsOfUseAccepted: true,
            privacyPolicyAccepted: true,
            ssoUser: false,
            selectedLanguage: 'en',
            defaultDomain: 1,

            sshKeys: [],
            hasSshKeys: false,
        } as User]);
        expect(mockDomainService.updateDomainGroup).toHaveBeenCalledWith(component.domainGroup, 1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/domains/groups']);
    });
});
