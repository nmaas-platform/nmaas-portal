/* tslint:disable:no-unused-variable */
import {fakeAsync, TestBed, waitForAsync} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {AppConfigService, ConfigurationService} from '../service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {Role, UserRole} from '../model/userrole';
import {ProfileService} from '../service/profile.service';
import {Observable, of} from 'rxjs';
import {Configuration} from '../model/configuration';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Service: Auth', () => {
    let authService: AuthService;
    let appConfigService: AppConfigService;
    let jwtHelperServiceSpy: jasmine.SpyObj<JwtHelperService>;
    let configurationService: ConfigurationService;
    let maintenanceServiceSpy: jasmine.SpyObj<ConfigurationService>;
    let httpMock: HttpTestingController;
    let store: any = {};

    beforeEach(waitForAsync(() => {
        const appConfigServiceStub: Partial<AppConfigService> = {
            config: {
                apiUrl: 'http://api.url',
                tokenName: 'token',
            },
            getTestInstanceModalKey: () => 'testModalKey'
        };
        const jwtSpy = jasmine.createSpyObj('JwtHelperService', ['decodeToken', 'isTokenExpired']);
        jwtSpy.decodeToken.and.returnValue({
            preferred_username: 'username',
            language: 'pl',
            sub: 'test-user',
            global_role: ['ROLE_SYSTEM_ADMIN'],
            roles: [`ROLE_USER`]
        });
        jwtSpy.isTokenExpired.and.callFake((arg: string): boolean => {
            return arg !== 'valid';
        });

        maintenanceServiceSpy = jasmine.createSpyObj('maintenanceService', ['getConfiguration']);
        maintenanceServiceSpy.getConfiguration.and.returnValue(of())

        class MockConfigurationService {
            protected uri: string;

            constructor() {
                this.uri = 'http://localhost/api';
            }

            public getApiUrl(): string {
                return 'http://localhost/api';
            }

            public getConfiguration(): Observable<Configuration> {
                return of<Configuration>();
            }

            public updateConfiguration(configuration: Configuration): Observable<any> {
                return of<Configuration>();
            }
        }


        const userRole = new UserRole();
        userRole.role = Role.ROLE_SYSTEM_ADMIN;
        userRole.domainName = 'test';
        userRole.domainId = 1;
        const userRole2 = new UserRole();
        userRole2.role = Role.ROLE_USER;
        userRole2.domainName = 'test2';
        userRole2.domainId = 2;
        const profileServiceStub = jasmine.createSpyObj('ProfileService', ['getRoles']);
        profileServiceStub.getRoles.and.returnValue(of([userRole, userRole2]))

        TestBed.configureTestingModule({
    imports: [],
    providers: [
        AuthService,
        { provide: AppConfigService, useValue: appConfigServiceStub },
        { provide: JwtHelperService, useValue: jwtSpy },
        { provide: ProfileService, useValue: profileServiceStub },
        { provide: ConfigurationService, useClass: MockConfigurationService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

        httpMock = TestBed.inject(HttpTestingController)
        authService = TestBed.inject(AuthService);
        authService.profile = [userRole, userRole2]
        appConfigService = TestBed.inject(AppConfigService);
        jwtHelperServiceSpy = TestBed.inject(JwtHelperService) as jasmine.SpyObj<JwtHelperService>;
        configurationService = TestBed.inject(ConfigurationService);
        // maintenanceServiceSpy = TestBed.get(ConfigurationService);

        // local store mock
        store = {token: 'valid'};

        spyOn(localStorage, 'getItem').and.callFake(function (key) {
            return store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value + '';
        });
        spyOn(localStorage, 'removeItem').and.callFake(function (key) {
            delete store[key];
        });

    }));
    afterEach(() => {
        httpMock.verify();
        store = {};
    });

    it('should create service', () => {
        expect(authService).toBeTruthy();
    });

    it('should get language from local store', () => {
        store = {lang: 'en'};
        const result = authService.getSelectedLanguage();
        expect(result).toEqual('en');
    });

    it('should get language from token', () => {
        const result = authService.getSelectedLanguage();
        expect(result).toEqual('pl');
    });

    it('should get username from token', () => {
        const result = authService.getUsername();
        expect(result).toEqual('test-user');
        store = {};
        expect(authService.getUsername()).toEqual(null)
    });

    it('should return true when role is present or false when role is absent', () => {
        const result = authService.hasRole(Role[Role.ROLE_SYSTEM_ADMIN]);
        expect(result).toEqual(true);
        const result2 = authService.hasRole(Role[Role.ROLE_DOMAIN_ADMIN]);
        expect(result2).toEqual(false);
    });

    it('should return true when role is present in domain and false otherwise', () => {
        const result = authService.hasDomainRole(2, Role[Role.ROLE_USER]);
        expect(result).toEqual(true);
        const result2 = authService.hasDomainRole(2, Role[Role.ROLE_DOMAIN_ADMIN]);
        expect(result2).toEqual(false);
    });

    it('should return domains from roles', () => {
        const result = authService.getDomains();
        expect(result).toContain(1);
        expect(result).toContain(2);
        store = {token: null};
        expect(authService.getDomains().length).toEqual(0)
    });

    it('should get roles', () => {
        const result = authService.getRoles();
        expect(result).toContain(Role[Role.ROLE_SYSTEM_ADMIN]);
        expect(result).toContain(Role[Role.ROLE_USER]);
        store = {token: null};
        expect(authService.getRoles().length).toEqual(0)
    });

    it('should return roles in domain map', () => {
        const result = authService.getDomainRoles();
        expect(result.size).toEqual(2);
        expect(result.has(1)).toEqual(true);
        expect(result.has(2)).toEqual(true);
        expect(result.get(1).getRoles()).toContain(Role[Role.ROLE_SYSTEM_ADMIN]);
        expect(result.get(2).hasRole(Role[Role.ROLE_USER])).toEqual(true);
        store = {token: null};
        expect(authService.getDomainRoles().size).toEqual(0);
    });

    it('should get domain where role present', () => {
        const r1 = authService.getDomainsWithRole(Role[Role.ROLE_SYSTEM_ADMIN]);
        expect(r1.length).toEqual(1);
        expect(r1).toContain(1);
        const r2 = authService.getDomainsWithRole(Role[Role.ROLE_USER]);
        expect(r2.length).toEqual(1);
        expect(r2).toContain(2);
        const r3 = authService.getDomainsWithRole(Role[Role.ROLE_DOMAIN_ADMIN]);
        expect(r3.length).toEqual(0);
    });

    it('should remove token on logout', () => {
        store['oidc-token'] = 'some-oidc-token';
        authService.logout();
        expect(store['token']).not.toBeDefined();
        const req = httpMock.expectOne('http://api.url/oidc/logout/some-oidc-token');
        req.flush({});
    });

    it('should be logged in when token is present and valid', () => {
        store = {token: 'valid'};
        let r: boolean;
        r = authService.isLogged();
        expect(r).toEqual(true);
        store = {token: 'expired'};
        r = authService.isLogged();
        httpMock.match(() => true).forEach(req => req.flush({}));
        expect(r).toEqual(false);
        store = {token: null};
        r = authService.isLogged();
        expect(r).toEqual(false);
    });

    it('should store token and oidc token in localStorage', () => {
        authService.storeToken('abc123');
        expect(store['token']).toEqual('abc123');

        authService.storeOidcToken('oidc456');
        expect(store['oidc-token']).toEqual('oidc456');
    });

    it('should remove roles from localStorage', () => {
        store['rolesToken'] = 'some_roles';
        authService.removeRoles();
        expect(store['rolesToken']).toBeUndefined();
    });

    it('should load and parse roles from localStorage', () => {
        const roles = [{domainId: 1, role: Role.ROLE_USER, domainName: 'x'}];
        store['rolesToken'] = JSON.stringify(roles);

        const result = authService.loadRoles();
        expect(result.length).toEqual(1);
        expect(result[0].role).toEqual(Role.ROLE_USER);
    });

    it('should assign loaded roles to profile', () => {
        const roles = [{domainId: 2, role: Role.ROLE_DOMAIN_ADMIN, domainName: 'x'}];
        store['rolesToken'] = JSON.stringify(roles);
        authService.loadAndSaveRoles();
        expect(authService.profile[0].role).toEqual(Role.ROLE_DOMAIN_ADMIN);
    });
    it('should stringify and store roles', () => {
        const roles = [new UserRole()];
        roles[0].domainId = 1;
        roles[0].role = Role.ROLE_USER;
        roles[0].domainName = 'dom1';

        authService.storeRoles(roles);
        expect(store['rolesToken']).toContain('ROLE_USER');
    });
    it('should get global role from token', () => {
        const result = authService.getGlobalRole();
        expect(result).toContain('ROLE_SYSTEM_ADMIN');
    });

    it('should handle login error with catchError', waitForAsync(() => {
        authService.login('user', 'pass').subscribe({
            next: () => fail('Expected error'),
            error: (err) => {
                expect(err.status).toEqual(401);
            }
        });

        const req = httpMock.expectOne('http://api.url/auth/basic/login');
        req.flush({message: 'Invalid credentials'}, {status: 401, statusText: 'Unauthorized'});
    }));

    it('should return only uniqe domainids', () => {
        (authService as any).profile = [
            {domainId: 1}, {domainId: 2}, {domainId: 1}
        ];
        const ids = authService.getDomainIds();
        expect(ids).toEqual([1, 2]);
    });

    it('getGlobalRole should return null when token is missing', () => {
        delete store['token'];
        expect(authService.getGlobalRole()).toBeNull();
    });

    it('getPreferredUsername should return preferred_username or null', () => {
        const name = authService.getPreferredUsername();
        expect(name).toBe('username');
        delete store['token'];
        expect(authService.getPreferredUsername()).toBeNull();
    });

});
