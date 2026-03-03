import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserDomainListComponent } from './user-domain-list.component';
import { UserService } from '../../../service/user.service';
import { DomainService } from '../../../service/domain.service';
import { UserDataService } from '../../../service/userdata.service';
import { AuthService } from '../../../auth/auth.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { User, UserListEntry } from '../../../model/user';
import { Role } from '../../../model/userrole';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ModalComponent} from '../../modal';

class TranslateFakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('UserDomainListComponent', () => {
  let component: UserDomainListComponent;
  let fixture: ComponentFixture<UserDomainListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let domainService: jasmine.SpyObj<DomainService>;
  let userDataService: jasmine.SpyObj<UserDataService>;
  let authService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(waitForAsync(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getAllList',
      'getAllListDomain',
      'getUserBySearch',
      'addRole',
      'removeRole',
      'changeUserStatus'
    ]);
    userServiceSpy.getAllListDomain.and.returnValue(of({
      content: [],
      totalPages: 0,
      totalElements: 0,
      pageable: null,
      last: true,
      size: 0,
      number: 0,
      sort: null,
      numberOfElements: 0,
      first: true,
      empty: true
    }));
    const domainServiceSpy = jasmine.createSpyObj('DomainService', ['getGlobalDomainId']);
    const userDataServiceSpy = jasmine.createSpyObj('UserDataService', [], {
      selectedDomainId: new BehaviorSubject<number>(1).asObservable()
    });
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsername', 'hasRole', 'hasDomainRole']);
    authServiceSpy.hasDomainRole.and.returnValue(true);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
    declarations: [UserDomainListComponent, ModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    imports: [FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: DomainService, useValue: domainServiceSpy },
        {
            provide: UserDataService,
            useValue: {
                selectedDomainId: of(1)
            }
        }, { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    domainService = TestBed.inject(DomainService) as jasmine.SpyObj<DomainService>;
    userDataService = TestBed.inject(UserDataService) as jasmine.SpyObj<UserDataService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDomainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users when domainId changes', () => {
    const mockUsers: UserListEntry[] = [
      { id: 1, username: 'user1', name: 'User One', email: 'user1@example.com', enabled: true, globalRole: 'ROLE_USER', domainsName: [], lastSuccessfulLoginDate: null, firstLoginDate: null, domainRole: Role.ROLE_GUEST },
      { id: 2, username: 'user2', name: 'User Two', email: 'user2@example.com', enabled: false, globalRole: 'ROLE_ADMIN', domainsName: [], lastSuccessfulLoginDate: null, firstLoginDate: null,domainRole: Role.ROLE_GUEST }
    ];
    userService.getAllListDomain.and.returnValue(of({
      content: mockUsers,
      totalPages: 1,
      totalElements: 2,
      pageable: null,
      last: true,
      size: 2,
      number: 0,
      sort: null,
      numberOfElements: 2,
      first: true,
      empty: false
    }));

    component.domainId = 1;
    component.loadUsers();

    expect(userService.getAllListDomain).toHaveBeenCalledWith(jasmine.any(Object), '', 1);
    expect(component.users).toEqual(mockUsers);
  });

  it('should apply filter and reload users', () => {
    const mockUsers: UserListEntry[] = [
      { id: 1, username: 'user1', name: 'User One', email: 'user1@example.com', enabled: true, globalRole: 'ROLE_USER', domainsName: [], lastSuccessfulLoginDate: null, firstLoginDate: null, domainRole: Role.ROLE_GUEST}
    ];
    userService.getAllListDomain.and.returnValue(of({
      content: mockUsers,
      totalPages: 1,
      totalElements: 2,
      pageable: null,
      last: true,
      size: 2,
      number: 0,
      sort: null,
      numberOfElements: 2,
      first: true,
      empty: false
    }));

    component.searchValue = 'User One';
    component.applyFilter();

    expect(userService.getAllListDomain).toHaveBeenCalled();
  });

  it('should clear filter and reset search value', () => {
    component.searchValue = 'User One';
    component.clearFilter();

    expect(component.searchValue).toBe('');
    expect(component.paginationSettings.pageNumber).toBe(1);
  });

  it('should add a user to the current domain', () => {
    const mockUser = { id: 1, username: 'user1' }
    userService.addRole.and.returnValue(of(null));

    component.domainId = 1;
    component.addToCurrentDomain(mockUser as User);

    expect(userService.addRole).toHaveBeenCalledWith(1, jasmine.anything(), 1);
  });

  it('should navigate to user view', () => {
    component.view(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/users/view/', 1]);
  });

  it('should change user status', () => {
    const mockUser = {
      id: 1,
      username: 'user1',
      enabled: false,
      firstname: 'User',
      lastname: 'One',
      email: 'user1@example.com',
      lastSuccessfulLoginDate: null,
      firstLoginDate: null,
      roles: [],
    };
    userService.changeUserStatus.and.returnValue(of(null));

    component.changeUserStatus(mockUser as User, true);

    expect(userService.changeUserStatus).toHaveBeenCalledWith(1, true);
    expect(mockUser.enabled).toBe(true);
  });

  it('should search users by value', () => {
    const mockUsers = [
      {
        id: 1,
        username: 'user1',
        enabled: false,
        firstname: 'User',
        lastname: 'One',
        email: 'user1@example.com',
        lastSuccessfulLoginDate: null,
        firstLoginDate: null,
        roles: [],
      }];
    userService.getUserBySearch.and.returnValue(of(mockUsers as User[]));

    component.searchUsers('User One');

    expect(userService.getUserBySearch).toHaveBeenCalledWith('User One', component.domainId);
  });
});
