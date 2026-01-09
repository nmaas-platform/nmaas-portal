import {BehaviorSubject, Observable, of, Subject, throwError as observableThrowError} from 'rxjs';
import {catchError, debounceTime, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AppConfigService, ConfigurationService} from '../service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProfileService} from '../service/profile.service';
import {Role, UserRole} from '../model/userrole';


export class DomainRoles {
    constructor(
        private readonly domainId: number,
        private readonly roles: string[] = []
    ) {
    }

    public getRoles(): string[] {
        return this.roles;
    }

    public hasRole(role: string): boolean {
        return (this.roles == null ? false : this.roles.indexOf(role) >= 0);
    }
}

@Injectable()
export class AuthService {

    private static readonly REFRESH_TOKEN: string = 'refresh-token';
    private static readonly OIDC_TOKEN: string = 'oidc-token';

    public loginUsingSsoService: boolean;

    private readonly isLoggedInSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
    public profile: UserRole[]

    private readonly rolesTabelName = 'rolesToken'

    private refresh: any;

    private maintenance = false;


    constructor(private readonly http: HttpClient,
                private readonly appConfig: AppConfigService,
                private readonly jwtHelper: JwtHelperService,
                private readonly profileService: ProfileService,
                private readonly maintenanceService: ConfigurationService) {
        this.loadAndSaveRoles();
        this.loadUser()
        this.getConfigurationToCheckMaintenance();
    }

    public loadUser(): void {

        this.profileService.getRoles().subscribe(roles => {
            this.profile = roles
            this.storeRoles(roles)
        })
    }

    public refreshUserRoles(): void {
        this.refresh = setInterval(() => {
            if (this.isLogged()) {
                this.refreshToken()
                this.loadUser();
            }
        }, 60000);
    }

    private getConfigurationToCheckMaintenance() {
        this.maintenanceService.getConfiguration().subscribe(value => {
            if (value?.maintenance) {
                console.warn('Maintenance is on. Disabled login.')
                this.isLoggedInSubject.next(false);
                this.logout();
                this.maintenance = true;
                return false;
            }
        });
    }

    public storeToken(token: string): void {
        localStorage.setItem(this.appConfig.config.tokenName, token);
    }

    public storeRefreshToken(token: string): void {
        localStorage.setItem(AuthService.REFRESH_TOKEN, token);
    }

    public storeOidcToken(token: string): void {
        localStorage.setItem(AuthService.OIDC_TOKEN, token);
    }

    public refreshToken() {
        return this.http.post<any>(this.appConfig.config.apiUrl + '/auth/basic/token', {
            refreshToken: this.getRefreshToken()
        }).subscribe(response => {
            const token = response?.['token'];
            const refreshToken = response?.[AuthService.REFRESH_TOKEN];
            if (token) {
                this.storeToken(token);
            }
            if (refreshToken) {
                this.storeRefreshToken(refreshToken)
            }
        })

    }

    public storeRoles(roles: UserRole[]): void {
        const rolesString = JSON.stringify(roles);
        localStorage.setItem(this.rolesTabelName, rolesString);
    }

    public loadAndSaveRoles() {
        this.profile = this.loadRoles();
    }

    public loadRoles(): UserRole[] {
        const rolesString = localStorage.getItem(this.rolesTabelName);
        if (!rolesString) {
            return null;
        }

        const parsed = JSON.parse(rolesString);
        return parsed.map((item: any) => Object.assign(new UserRole(), item));
    }

    public removeRoles(): void {
        localStorage.removeItem(this.rolesTabelName)
    }

    private getToken(): string {
        return localStorage.getItem(this.appConfig.config.tokenName)
    }

    private getOidcToken(): string {
        return localStorage.getItem(AuthService.OIDC_TOKEN)
    }

    private getRefreshToken(): string {
        return localStorage.getItem(AuthService.REFRESH_TOKEN)
    }

    private removeToken(): void {
        localStorage.removeItem(this.appConfig.config.tokenName);
    }

    private removeOidcToken(): void {
        localStorage.removeItem(AuthService.OIDC_TOKEN);
    }

    public getSelectedThemeMode(): string {
        return this.getToken() == null ? undefined : this.jwtHelper.decodeToken(this.getToken()).thememode;
    }

    public getSelectedLanguage(): string {
        if (localStorage.getItem('lang') != null) {
            return localStorage.getItem('lang')
        }
        return this.getToken() == null ? undefined : this.jwtHelper.decodeToken(this.getToken()).language;
    }

    public getUsername(): string {
        const token = this.getToken();
        return (token ? this.jwtHelper.decodeToken(token).sub : null);
    }

    public getPreferredUsername(): string {
        const token = this.getToken();
        return (token ? this.jwtHelper.decodeToken(token).preferred_username : null);
    }

    public hasRole(name: string): boolean {

        const roles = this.getRoles()

        for (const role of roles) {
            if (role === name) {
                return true;
            }
        }
        return false;

    }

    public hasDomainRole(domainId: number, name: string): boolean {
        let result = false;
        const domainRoles: Map<number, DomainRoles> = this.getDomainRoles();
        for (const [mapDomainId, domainRolesValue] of domainRoles) {
            if (mapDomainId === domainId) {
                domainRolesValue.getRoles().forEach(role => {
                    if (role === name) {
                        result = true;
                    }
                })
            }
        }
        return result;
    }

    public getGlobalRole(): string[] {
        const token = this.getToken();
        if (token == null) {
            return null;
        }
        return this.jwtHelper.decodeToken(token).global_role;
    }

    public getDomainRoles(): Map<number, DomainRoles> {
        const domainRolesMap: Map<number, DomainRoles> = new Map<number, DomainRoles>();

        const domains: number[] = this.getDomains();
        for (const domain of domains) {
            const roles: string[] = this.profile
                .filter(userRole => userRole.domainId === domain)
                .map(userRole => Role[userRole.role])

            domainRolesMap.set(domain, new DomainRoles(domain, roles));

        }
        return domainRolesMap;
    }

    public getRoles(): string[] {
        const roles: string[] = [];

        const token = this.getToken();
        if (token == null) {
            return roles;
        }
        const domainRoles: string[] = this.jwtHelper.decodeToken(token).roles;
        const globalRole: string[] = this.jwtHelper.decodeToken(token).global_role;

        roles.push(globalRole[0]);

        for (const role of domainRoles) {

            roles.push(role);
        }

        return roles;
    }


    public getDomains(): number[] {
        if (this.isLogged()) {
            if (this.profile !== undefined && this.profile !== null) {
                return this.getDomainIds();
            } else {
                return [];
            }

        }
        return [];

    }

    public getDomainsWithRole(name: string): number[] {
        const domainsWithRole: number[] = [];
        const domains: number[] = this.getDomains();
        domains.forEach((domainId) => {
            if (this.hasDomainRole(domainId, name)) {
                domainsWithRole.push(domainId);
            }
        });

        return domainsWithRole;
    }

    public oidcLinkingLogin(oidcToken: string,
                            email: string,
                            password: string,
                            uuid: string,
                            firstName: string,
                            lastName: string) {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});

        return this.http.post(this.appConfig.config.apiUrl + '/oidc/link',
            JSON.stringify(
                {
                    'oidcToken': oidcToken,
                    'email': email,
                    'password': password,
                    'uuid': uuid,
                    'firstName': firstName,
                    'lastName': lastName,
                }
            ),
            {headers: headers}).pipe(
            debounceTime(1000),
            map((res: Response) => {
                    const resToken = res?.['token'];
                    const resOidcToken = res?.['resOidcToken'];
                    if (resToken && resOidcToken) {
                        this.storeToken(resToken);
                        this.storeOidcToken(resOidcToken);
                        this.loginUsingSsoService = false;
                        this.isLoggedInSubject.next(true);
                        this.profileService.getRoles().subscribe(profile => {
                            this.profile = profile
                            this.storeRoles(profile);
                            return true;
                        })
                    } else {
                        this.isLoggedInSubject.next(false);
                        return false;
                    }
                }
            ),
        )
    }

    public approveAupAndPn(oidcToken: string,
                           email: string,
                           password: string,
                           uuid: string,
                           firstName: string,
                           lastName: string,
                           username: string,
                           isAupChecked: boolean,
                           isPnChecked: boolean): Observable<boolean> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
        return this.http.post(this.appConfig.config.apiUrl + '/oidc/approvals',
            JSON.stringify(
                {
                    'oidcToken': oidcToken,
                    'email': email,
                    'password': password,
                    'uuid': uuid,
                    'firstName': firstName,
                    'lastName': lastName,
                    'username': username,
                    'isAupApprove': isAupChecked,
                    'isPnApprove': isPnChecked
                }
            ),
            {headers: headers}).pipe(
                debounceTime(1000),
            map((res: Response) => {
                const resToken = res?.['token'];
                const resOidcToken = res?.['resOidcToken'];
                if (resToken && resOidcToken) {
                    this.storeToken(resToken);
                    this.storeOidcToken(resOidcToken);
                    this.loginUsingSsoService = false;
                    this.isLoggedInSubject.next(true);
                    this.profileService.getRoles().subscribe(profile => {
                        this.profile = profile
                        this.storeRoles(profile);
                        return true;
                    })
                } else {
                    this.isLoggedInSubject.next(false);
                    return false;
                }
            })
        )


    }

    public login(username: string, password: string): Observable<boolean> {
        // hack so test instance modal is shown onl after login
        localStorage.setItem(this.appConfig.getTestInstanceModalKey(), 'True');

        if (this.maintenance) {
            this.isLoggedInSubject.next(false);
            console.warn('Maintenance is on. Disabled login.')
            // add toast here
            return of(false);
        }

        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
        return this.http.post(this.appConfig.config.apiUrl + '/auth/basic/login',
            JSON.stringify({'username': username, 'password': password}), {headers: headers}).pipe(
            debounceTime(10000),
            map((response: Response) => {
                // login successful if there's a jwt token in the response
                const token = response?.['token'];
                const refreshToken = response?.[AuthService.REFRESH_TOKEN];
                if (token && refreshToken) {
                    // set token property
                    this.storeToken(token);
                    this.storeRefreshToken(refreshToken)
                    this.loginUsingSsoService = false;
                    this.isLoggedInSubject.next(true);
                    this.profileService.getRoles().subscribe(profile => {
                        this.profile = profile
                        this.storeRoles(profile);
                        return true;
                    })
                } else {
                    // return false to indicate failed login
                    this.isLoggedInSubject.next(false);
                    return false;
                }
            }),
            catchError((error) => {
                let message: string;
                if (error.error['message']) {
                    message = error.error['message'];
                } else {
                    message = 'Server error';
                }

                return observableThrowError(error);
            }));
    }

    public logout(): void {
        const oidcToken = this.getOidcToken();
        this.refresh = null;
        if (oidcToken === null) {
            this.removeToken();
            this.isLoggedInSubject.next(false);
            localStorage.removeItem('_expiredTime');
            localStorage.removeItem('selectedDomainId');
        } else {
            this.removeToken();
            this.removeOidcToken();
            this.isLoggedInSubject.next(false);
            localStorage.removeItem('_expiredTime');
            localStorage.removeItem('selectedDomainId');
            this.http.get(this.appConfig.config.apiUrl + '/oidc/logout/' + oidcToken).subscribe(() => {
            })
        }
        sessionStorage.removeItem('sshKeyReminded');
    }

    public oidcLogout(oidcToken: string): void {
        this.http.get(this.appConfig.config.apiUrl + '/oidc/logout/' + oidcToken).subscribe(() => {
        })
    }

    get isLoggedIn$(): Observable<boolean> {
        this.isLoggedInSubject.next(this.isLogged());
        return this.isLoggedInSubject.pipe(
            debounceTime(100), // use debounceTime to aggregate multiple emissions https://rxjs.dev/api/operators/debounceTime
        );
    }

    public isLogged(): boolean {
        const token = this.getToken();
        if (token == null) {
            return false;
        }
        if (this.jwtHelper.isTokenExpired(token)) {
            this.logout()
            return false;
        }
        return true;

    }

    public getDomainIds(): number[] {
        return Array.from(new Set(this.profile.map(ur => ur.domainId)));
    }

}
