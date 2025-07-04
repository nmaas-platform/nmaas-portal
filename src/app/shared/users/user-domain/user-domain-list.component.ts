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
    styleUrl: './user-domain-list.component.css',
    standalone: false
})
export class UserDomainListComponent extends BaseComponent implements OnInit, OnDestroy {
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
    if (this.isInAddToDomainMode) {
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
    if (event.value !== null) {
      this.userService.addRole(user.id, event.value, domainId).subscribe(() => this.loadUsers())
    } else {
      const foundUser = this.users.find(user => user.id === event.userId);
      this.onRemoveRole({ id: user.id, role: event.value })
    }
  }

  public onRemoveRole($event): void {
    this.userService.removeRole(
      $event.id, $event.value, this.domainId).subscribe(
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

