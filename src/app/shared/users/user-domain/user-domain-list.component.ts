import { User, UserListEntry } from '../../../model';
import { CacheService, CustomerSearchCriteria, DomainService, UserService } from '../../../service';
import { BaseComponent } from '../../common/basecomponent/base.component';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject } from 'rxjs';

import { Role, UserRole } from '../../../model/userrole';
import { UserDataService } from '../../../service/userdata.service';
import { AuthService } from '../../../auth/auth.service';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationSettings, PrimeNgLazyLoadEvent } from '../../../service/page';


@Component({
  selector: 'user-domain-list',
  templateUrl: './user-domain-list.component.html',
  styleUrl: './user-domain-list.component.css'
})
export class UserDomainListComponent  extends BaseComponent implements OnInit, OnDestroy  {
public users_item_number_key = 'NUMBER_OF_USERS_ITEM_KEY';


    public pageNumber = 1;
    public paginatorName = 'paginator-identifier';
    public itemsPerPage: number[] = [15, 20, 25, 30, 50];
    public maxItemsOnPage = 15;

    public domainId: number;
    public paginationSettings: PaginationSettings = new PaginationSettings(0, 15, 1, 'id', 'asc', {}, 0);
    public searchValue = '';

    public users: UserListEntry[] = [];
    public loading: boolean = false;
    public Role = Role;
    public isInAddToDomainMode = false;

    public usersToAdd: User[] = [];


    private lazyLoadSubject = new Subject<PrimeNgLazyLoadEvent>();
    private debounceTimeMs = 300; // Debounce time in milliseconds (e.g., 300ms)


    constructor(private userService: UserService,
        public domainService: DomainService,
        private userDataService: UserDataService,
        public authService: AuthService,
        private router: Router,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        // set stored value of maxElementsPerPage
        const i = sessionStorage.getItem(this.users_item_number_key);
        if (i) {
            this.maxItemsOnPage = +i;
        }

        this.userDataService.selectedDomainId.subscribe(domain => {
            this.domainId = domain;
            this.searchValue = "";
            this.loadUsers();
            
        });
        // this.getAllDomain();

        this.lazyLoadSubject.pipe(
            debounceTime(this.debounceTimeMs), // Wait for debounceTimeMs after the last event
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)) // Only proceed if the event parameters have changed
        ).subscribe(event => {
            this.loadUsers(event); // Call the actual loading method
        });

    }

    ngOnDestroy(): void {
        this.lazyLoadSubject.complete(); // Complete the subject to prevent memory leaks
        this.lazyLoadSubject.unsubscribe(); // Unsubscribe from the subject
    }

    private setPaginationSettings(page: any): void {
        this.paginationSettings.totalPages = page.totalPages;
        this.paginationSettings.totalElements = page.totalElements; // Set the total number of elements
    }

    onTableLazyLoad(event: PrimeNgLazyLoadEvent): void {
        this.lazyLoadSubject.next(event); // Emit the event to the Subject
    }


    loadUsers(event?: PrimeNgLazyLoadEvent): void {
        this.loading = true;
        this.cdr.detectChanges();
        console.log('Loading domains with event:', event);


        if (event) {
            this.paginationSettings.maxItemsOnPage = event.rows;
            this.paginationSettings.pageNumber = (event.rows > 0) ? Math.floor(event.first / event.rows) + 1 : 1;

            this.paginationSettings.sortField = event.sortField || 'id';
            this.paginationSettings.sortOrder = event.sortOrder === 1 ? 'asc' : (event.sortOrder === -1 ? 'desc' : 'asc');

        }

        const paginatorEventForService: PrimeNgLazyLoadEvent = {
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: {}
        };

        if (this.domainId !== null && this.domainId === this.domainService.getGlobalDomainId()) {
            this.userService.getAllList(paginatorEventForService, this.searchValue).subscribe({
                next: (page) => {
                    this.setPaginationSettings(page);
                    this.users = page.content;
                    this.loading = false; // Stop loading
                    this.cdr.detectChanges(); // Trigger change detection
                },
                error: (error) => {
                    console.error('Error loading users:', error);
                    this.loading = false; // Stop loading on error
                }
            });
        } else {
            this.userService.getAllListDomain(paginatorEventForService, this.searchValue, this.domainId).subscribe({
                next: (page) => {
                    this.setPaginationSettings(page);
                    this.users = page.content;
                    this.loading = false; // Stop loading
                    this.cdr.detectChanges(); // Trigger change detection
                },
                error: (error) => {
                    console.error('Error loading users:', error);
                    this.loading = false; // Stop loading on error
                }
            });
        }


    }

    applyFilter(): void {
      if(this.isInAddToDomainMode) { 
        this.searchUsers(this.searchValue); // Call searchUsers if in add to domain mode
      } else {
        console.log('Applying filter with searchValue:', this.searchValue);
        this.paginationSettings.pageNumber = 1; // Reset to page 1 for new filter
        this.paginationSettings.totalElements = 0; // Reset total records to force re-fetch
        this.lazyLoadSubject.next({ // Emit an event to trigger loadDomains via debounce
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: { searchValue: this.searchValue } // Pass the searchValue as a filter
        });
      }
        
    }

    clearFilter(): void {
        this.searchValue = '';
        this.paginationSettings.pageNumber = 1;
        this.paginationSettings.totalElements = 0; // Reset total records for a clean fetch
        this.lazyLoadSubject.next({ // Emit an event to trigger loadDomains via debounce
            first: (this.paginationSettings.pageNumber - 1) * this.paginationSettings.maxItemsOnPage,
            rows: this.paginationSettings.maxItemsOnPage,
            sortField: this.paginationSettings.sortField,
            sortOrder: this.paginationSettings.sortOrder === 'asc' ? 1 : -1,
            filters: {}
        });
    }

    onSearchValueChange(event: any): void {
        if ((!this.searchValue || this.searchValue.trim() === '')) {
            this.clearFilter(); // Call clearFilter if the search field is empty
        }

    }

     public onUserView($event): void {
        this.router.navigate(['/admin/users/view/', $event]);
    }

    public view(userId: number): void {
        this.router.navigate(['/admin/users/view/', userId]);
    }

    public changeUserStatus(user: User, enabled: boolean): void {
        this.userService.changeUserStatus(user.id, enabled).subscribe();
        user.enabled = enabled;
    }

    public isGlobalGuestAndHasNoRoleInThisDomain(user: UserListEntry): boolean {
        const isGlobalGuest = user.globalRole === Role[Role.ROLE_GUEST];
        const hasNoRoleInThisDomain = user.roles.filter(r => r.domainId === this.domainId).length === 0;
        return isGlobalGuest && hasNoRoleInThisDomain;
    }


    public canUserBeDeleted(user: User): boolean {
        if (user.enabled) {
            return false;
        }
        if (user.ssoUser) {
            return false;
        }
        const result = user.roles.find(
            role => !(roleConvert(role.role) === Role.ROLE_GUEST && role.domainId === this.domainService.getGlobalDomainId())
        );
        return !result;
    }

        public checkUserIfIsCurrentUser(userName: string) {
        return this.authService.getUsername() === userName
    }

    public trincateDomainNames(domainsName: string[] = []): string {
        if (domainsName?.length > 2) {
            return domainsName?.slice(0, 2).join(', ') + ' and ' + (domainsName?.length - 2) + ' more';
        } else {
            return domainsName?.join(', ');
        }
    }

      public getOnlyDomainRoles(user: User): UserRole {
        return user.roles.find(role => role.domainId === this.domainId);
    }

        public getAllowedRoles(): Role[] {
        let roles: Role[];
        if (this.authService.hasRole(Role[Role.ROLE_SYSTEM_ADMIN]) &&  
            Number(this.domainId === this.domainService.getGlobalDomainId())) {
            // admin (global) role set
            roles = [Role.ROLE_OPERATOR, Role.ROLE_TOOL_MANAGER, Role.ROLE_SYSTEM_ADMIN];
            // roles = this.filterRoles(roles, this.domainId);
        } else if (this.domainId != null) {
            // default (domain) role set
            roles = [Role.ROLE_USER, Role.ROLE_DOMAIN_ADMIN, Role.ROLE_GUEST];
        } else {
            // no roles
            roles = [];
        }
        return roles;
    }

        public changeUserRole(user: User, domainId: number, event: any) {
        console.warn(event.value);
        if (event.value !== null) {
            this.userService.addRole(user.id, event.value, domainId).subscribe(() => this.loadUsers())
        } else {
            const foundUser = this.users.find(user => user.id === event.userId);
            this.onRemoveRole({ id: user.id, roles: foundUser.roles })
        }
    }

    public onRemoveRole($event): void {
        this.userService.removeRole(
            $event.id, $event.roles.find(value => value.domainId === this.domainId).role, this.domainId).subscribe(
                () => this.loadUsers()
            )
    }

    public changeMode() {
        this.isInAddToDomainMode = !this.isInAddToDomainMode;
    }

     public searchUsers(search: string) {
        if (search === '') {
            this.usersToAdd = [];
        } else {
                this.userService.getUserBySearch(search, this.domainId).subscribe(data => {
                    console.log('Search results:', data);
                    this.usersToAdd = data;
                })
            
        }
    }

    public addToCurrentDomain(user: User) {
        this.userService.addRole(user.id, Role.ROLE_USER, this.domainId).subscribe(() => {
            this.loadUsers();
            this.isInAddToDomainMode = false; 
        });
    }


}

function roleConvert(role: string | Role): Role {
    if (typeof role === 'string') {
        return Role[role];
    }
    return role;
}

//     @Input()
//     public users: User[] = []; // provided list of users

//     @Input()
//     public domainMode = false;

//     public displayUsers: User[] = []; // list of users after transformations

//     public domainId: number;

//     @Output()
//     public onDelete: EventEmitter<User> = new EventEmitter<User>();

//     @Output()
//     public onView: EventEmitter<number> = new EventEmitter<number>();

//     @Output()
//     public onAddToDomain: EventEmitter<User> = new EventEmitter<User>();

//     @Output()
//     public onRemoveFromDomain: EventEmitter<User> = new EventEmitter<User>();

//     @Output()
//     public onModeChange: EventEmitter<number> = new EventEmitter<number>();

//     @Output()
//     public onUserRoleChange: EventEmitter<any> = new EventEmitter<any>();

//     public domainCache: CacheService<number, Domain> = new CacheService<number, Domain>();

//     private lastSearchCriteria: CustomerSearchCriteria = undefined;

//     public pageNumber = 1;
//     public paginatorName = 'paginator-identifier';
//     public itemsPerPage: number[] = [15, 20, 25, 30, 50];
//     public maxItemsOnPage = 15;

//     public filteredUsers: User[] = [];

//     public searchText = new UntypedFormControl('');
//     public Role = Role;

//     constructor(private userService: UserService,
//                 public domainService: DomainService,
//                 private userDataService: UserDataService,
//                 public authService: AuthService,
//                 private router: Router,
//                 private translate: TranslateService) {
//         super();
//         userDataService.selectedDomainId.subscribe(domain => this.domainId = domain);
//     }

//     ngOnInit() {
//         // set stored value of maxElementsPerPage
//         const i = sessionStorage.getItem(this.users_item_number_key);
//         if (i) {
//             this.maxItemsOnPage = +i;
//         }

//         this.searchText.valueChanges.subscribe(
//             term => this.onSearch(term)
//         )

//         this.userDataService.selectedDomainId.subscribe(domain => this.domainId = domain);
//         this.getAllDomain();

//     }

//     ngOnChanges(changes: SimpleChanges): void {
//         this.displayUsers = this.users;
//     }

//     public getAllDomain() {
//         if(this.domainMode) {
//             this.domainService.getMyDomains().subscribe(domains => {
//                 domains.forEach(domain => { 
//                     this.domainCache.setData(domain.id, domain)
//                 }
//             ) })
//         } else {
//             this.domainService.getAllBase().subscribe(domains => {
//                 domains.forEach(domain => {
//                     this.domainCache.setData(domain.id, domain)
//                 })
//             })
//         }
//     }

//     public getDomainName(domainId: number): Observable<string> {
//         if (this.domainCache.hasData(domainId)) {
//             return of(this.domainCache.getData(domainId).name);
//         } else {
//             return new Observable<string>()
//         }
//     }

//     public filterDomainNames(user: User): UserRole[] {
//         return user.roles.filter(role => role.domainId !== this.domainService.getGlobalDomainId());
//     }

  

//     public getGlobalRole(user: User): string {
//         const userRole: UserRole[] = user.roles.filter(role => role.domainId === this.domainService.getGlobalDomainId());
//         return userRole[0].role.toString();
//     }

//     public getUserDomainIds(user: User): number[] {
//         if (user !== undefined) {
//             return user.getDomainIds();
//         } else {
//             return [];
//         }
//     }

//     public remove(user: User) {
//         this.onDelete.emit(user);
//     }

//     public view(userId: number): void {
//         if (!this.domainMode) {
//             this.onView.emit(userId);
//         }
//     }

//     public changeUserStatus(user: User, enabled: boolean): void {
//         this.userService.changeUserStatus(user.id, enabled).subscribe();
//         user.enabled = enabled;
//         // sort after changing params
//         if (this.lastSearchCriteria) {
//             this.handleSortEvent(this.lastSearchCriteria);
//         }
//     }

//     onSorted($event) {
//         console.log('onSort', $event);
//         this.displayUsers = this.users;
//         this.handleSearchEvent(this.searchText.value)
//         this.handleSortEvent($event);
//     }

//     onSearch(term) {
//         console.log('onSearch', term)
//         this.displayUsers = this.users;
//         this.handleSearchEvent(term)
//         this.handleSortEvent(this.lastSearchCriteria);
//     }

//     handleSearchEvent(term: string) {
//         console.warn(this.displayUsers.filter(
//             u => userMatches(u, term)
//         ))
//         this.displayUsers = this.displayUsers.filter(
//             u => userMatches(u, term)
//         )
//     }

//     handleSortEvent(criteria: CustomerSearchCriteria) {
//         this.lastSearchCriteria = criteria;
//         const baseSortFunc = (a: any, b: any): number => {
//             if (a < b) {
//                 return -1;
//             }
//             if (a > b) {
//                 return 1;
//             }
//             return 0;
//         };

//         this.displayUsers.sort(
//             (a: User, b: User) => {
//                 if (!criteria) {
//                     return 0;
//                 }
//                 const direction = criteria.sortDirection === 'asc' ? 1 : -1;
//                 let result: number;

//                 let p1: any, p2: any;

//                 // sorting rules for custom columns
//                 if (criteria.sortColumn === 'domains') {
//                     const ad = this.filterDomainNames(a);
//                     const bd = this.filterDomainNames(b);
//                     if (!ad) {
//                         console.log(ad);
//                     }
//                     if (!bd) {
//                         console.log(bd);
//                     }
//                     const ar = ad.length > 0 ? ad[0].domainId : 0;
//                     const br = bd.length > 0 ? bd[0].domainId : 0;
//                     p1 = ar;
//                     p2 = br;
//                 } else if (criteria.sortColumn === 'globalRole') {
//                     p1 = this.getGlobalRole(a);
//                     p2 = this.getGlobalRole(b);
//                 } else if (criteria.sortColumn === 'roles') {
//                     const ad = this.getOnlyDomainRoles(a);
//                     const bd = this.getOnlyDomainRoles(b);
//                     const ar = ad !== undefined ? ad[0].role.toString() : '';
//                     const br = bd !== undefined ? bd[0].role.toString() : '';
//                     p1 = ar;
//                     p2 = br;
//                 } else {
//                     p1 = a[criteria.sortColumn];
//                     p2 = b[criteria.sortColumn];
//                 }

//                 if (typeof p1 === 'string' && typeof p2 === 'string') {
//                     p1 = p1.toLowerCase();
//                     p2 = p2.toLowerCase();
//                 }

//                 result = baseSortFunc(p1, p2);

//                 return result * direction;
//             }
//         )
//     }

//     public setItems(item) {
//         // store max items per page value in this session
//         sessionStorage.setItem(this.users_item_number_key, item);
//         this.maxItemsOnPage = item;
//     }

//     public isGlobalGuestAndHasNoRoleInThisDomain(user: User): boolean {
//         const isGlobalGuest = user.roles.filter(r =>
//             r.domainId === this.domainService.getGlobalDomainId() &&
//             typeof r.role === 'string' ? Role[r.role] : r.role === Role.ROLE_GUEST).length > 0;
//         // console.log('is global guest:\t' + isGlobalGuest);
//         const hasNoRoleInThisDomain = user.roles.filter(r => r.domainId === this.domainId).length === 0;
//         return isGlobalGuest && hasNoRoleInThisDomain;
//     }

//     public addToCurrentDomain(user: User) {
//         this.onAddToDomain.emit(user);
//         this.changeMode();
//     }

//     public changeMode() {
//         this.onModeChange.emit(0);
//     }

//     public canUserBeDeleted(user: User): boolean {
//         if (user.enabled) {
//             return false;
//         }
//         if (user.ssoUser) {
//             return false;
//         }
//         const result = user.roles.find(
//             role => !(roleConvert(role.role) === Role.ROLE_GUEST && role.domainId === this.domainService.getGlobalDomainId())
//         );
//         return !result;
//     }

//     public searchUsers(search: string) {
//         if (search === '') {
//             this.filteredUsers = [];
//         } else {
//             if (this.allowedModes.find(v => v === ComponentMode.EDIT) !== undefined) {
//                 this.userService.getUserBySearch(search, this.domainId).subscribe(data => {
//                     this.filteredUsers = data;
//                     this.displayUsers = this.filteredUsers;
//                 })
//             } else {
//                 // this.displayUsers = this.users;
//             }
//         }
//     }





//     public changeUserRole(user: User, domainId: number, event: any) {
//         console.warn(event);
//         this.onUserRoleChange.emit({userId: user.id, domainId: domainId, role: event.value})
//     }


//     customSort(event: any) {
//         const { order } = event;

//         const roleKeys = this.displayUsers.map(user =>
//             this.getGlobalRole(user).toUpperCase()
//         );
//         const uniqueKeys = [...new Set(roleKeys)];
//         const translationKeys = uniqueKeys.map(key => `ENUM.USER_ROLES.${key}`);

//         this.translate.get(translationKeys).subscribe(translations => {
//             this.displayUsers.sort((a, b) => {
//                 const keyA = `ENUM.USER_ROLES.${this.getGlobalRole(a).toUpperCase()}`;
//                 const keyB = `ENUM.USER_ROLES.${this.getGlobalRole(b).toUpperCase()}`;

//                 const translatedA = translations[keyA] || '';
//                 const translatedB = translations[keyB] || '';

//                 return translatedA.localeCompare(translatedB) * order;
//             });
//         });
//     }
// }

// function roleConvert(role: string | Role): Role {
//     if (typeof role === 'string') {
//         return Role[role];
//     }
//     return role;
 

