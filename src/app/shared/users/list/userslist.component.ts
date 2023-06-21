import {Domain} from '../../../model/domain';
import {User} from '../../../model';
import {CacheService, CustomerSearchCriteria, DomainService, UserService} from '../../../service';
import {BaseComponent} from '../../common/basecomponent/base.component';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Observable, of} from 'rxjs';

import {Role, UserRole} from '../../../model/userrole';
import {UserDataService} from '../../../service/userdata.service';
import {AuthService} from '../../../auth/auth.service';
import {map, shareReplay, take} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ComponentMode} from '../../common/componentmode';
import {Router} from '@angular/router';

function userMatches(u: User, term: string): boolean {
  const t = term || ''
  return (u.username || '').toLowerCase().includes(t.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(t.toLowerCase()) ||
      (u.firstname || '').toLowerCase().includes(t.toLowerCase()) ||
      (u.lastname || '').toLowerCase().includes(t.toLowerCase())
}

@Component({
  selector: 'nmaas-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css']
})
export class UsersListComponent extends BaseComponent implements OnInit, OnChanges {

  public users_item_number_key = 'NUMBER_OF_USERS_ITEM_KEY';

  @Input()
  public users: User[] = []; // provided list of users

  @Input()
  public domainMode = false;

  public displayUsers: User[] = []; // list of users after transformations

  public domainId: number;

  @Output()
  public onDelete: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  public onView: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public onAddToDomain: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  public onRemoveFromDomain: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  public onModeChange: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public onUserRoleChange: EventEmitter<any> = new EventEmitter<any>();

  public domainCache: CacheService<number, Domain> = new CacheService<number, Domain>();

  private lastSearchCriteria: CustomerSearchCriteria = undefined;

  public pageNumber = 1;
  public paginatorName = 'paginator-identifier';
  public itemsPerPage: number[] = [15, 20, 25, 30, 50];
  public maxItemsOnPage = 15;

  public filteredUsers: User[] = [];

  public searchText = new FormControl('');
  public Role = Role;

  constructor(private userService: UserService,
              public domainService: DomainService,
              private userDataService: UserDataService,
              public authService: AuthService,
              private router: Router) {
    super();
    userDataService.selectedDomainId.subscribe(domain => this.domainId = domain);
  }

  ngOnInit() {
    // set stored value of maxElementsPerPage
    const i = sessionStorage.getItem(this.users_item_number_key);
    if (i) {
      this.maxItemsOnPage = +i;
    }

    this.searchText.valueChanges.subscribe(
        term => this.onSearch(term)
    )

    this.userDataService.selectedDomainId.subscribe(domain => this.domainId = domain);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.displayUsers = this.users;
  }

  public getDomainName(domainId: number): Observable<string> {
    if (this.domainCache.hasData(domainId)) {
      return of(this.domainCache.getData(domainId).name);
    } else {
      return this.domainService.getOne(domainId).pipe(
          map((domain) => {
            this.domainCache.setData(domainId, domain);
            return domain.name
          }),
          shareReplay(1),
          take(1));
    }
  }

  public filterDomainNames(user: User): UserRole[] {
    return user.roles.filter(role => role.domainId !== this.domainService.getGlobalDomainId());
  }

  public getOnlyDomainRoles(user: User): UserRole[] {
    return user.roles.filter(role => role.domainId === this.domainId);
  }

  public getGlobalRole(user: User): string {
    const userRole: UserRole[] = user.roles.filter(role => role.domainId === this.domainService.getGlobalDomainId());
    return userRole[0].role.toString();
  }

  public getUserDomainIds(user: User): number[] {
    if (user !== undefined) {
      return user.getDomainIds();
    } else {
      return [];
    }
  }

  public remove(user: User) {
    this.onDelete.emit(user);
  }

  public view(userId: number): void {
    if (!this.domainMode) {
      this.onView.emit(userId);
    }
  }

  public changeUserStatus(user: User, enabled: boolean): void {
    this.userService.changeUserStatus(user.id, enabled).subscribe();
    user.enabled = enabled;
    // sort after changing params
    if (this.lastSearchCriteria) {
      this.handleSortEvent(this.lastSearchCriteria);
    }
  }

  onSorted($event) {
    console.log('onSort', $event);
    this.displayUsers = this.users;
    this.handleSearchEvent(this.searchText.value)
    this.handleSortEvent($event);
  }

  onSearch(term) {
    console.log('onSearch', term)
    this.displayUsers = this.users;
    this.handleSearchEvent(term)
    this.handleSortEvent(this.lastSearchCriteria);
  }

  handleSearchEvent(term: string) {
    console.warn(this.displayUsers.filter(
        u => userMatches(u, term)
    ))
    this.displayUsers = this.displayUsers.filter(
        u => userMatches(u, term)
    )
  }

  handleSortEvent(criteria: CustomerSearchCriteria) {
    this.lastSearchCriteria = criteria;
    const baseSortFunc = (a: any, b: any): number => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    };

    this.displayUsers.sort(
        (a: User, b: User) => {
          if (!criteria) {
            return 0;
          }
          const direction = criteria.sortDirection === 'asc' ? 1 : -1;
          let result: number;

          let p1: any, p2: any;

          // sorting rules for custom columns
          if (criteria.sortColumn === 'domains') {
            const ad = this.filterDomainNames(a);
            const bd = this.filterDomainNames(b);
            if (!ad) {
              console.log(ad);
            }
            if (!bd) {
              console.log(bd);
            }
            const ar = ad.length > 0 ? ad[0].domainId : 0;
            const br = bd.length > 0 ? bd[0].domainId : 0;
            p1 = ar;
            p2 = br;
          } else if (criteria.sortColumn === 'globalRole') {
            p1 = this.getGlobalRole(a);
            p2 = this.getGlobalRole(b);
          } else if (criteria.sortColumn === 'roles') {
            const ad = this.getOnlyDomainRoles(a);
            const bd = this.getOnlyDomainRoles(b);
            const ar = ad.length > 0 ? ad[0].role.toString() : '';
            const br = bd.length > 0 ? bd[0].role.toString() : '';
            p1 = ar;
            p2 = br;
          } else {
            p1 = a[criteria.sortColumn];
            p2 = b[criteria.sortColumn];
          }

          if (typeof p1 === 'string' && typeof p2 === 'string') {
            p1 = p1.toLowerCase();
            p2 = p2.toLowerCase();
          }

          result = baseSortFunc(p1, p2);

          return result * direction;
        }
    )
  }

  public setItems(item) {
    // store max items per page value in this session
    sessionStorage.setItem(this.users_item_number_key, item);
    this.maxItemsOnPage = item;
  }

  public isGlobalGuestAndHasNoRoleInThisDomain(user: User): boolean {
    const isGlobalGuest = user.roles.filter(r =>
        r.domainId === this.domainService.getGlobalDomainId() &&
        typeof r.role === 'string' ? Role[r.role] : r.role === Role.ROLE_GUEST).length > 0;
    // console.log('is global guest:\t' + isGlobalGuest);
    const hasNoRoleInThisDomain = user.roles.filter(r => r.domainId === this.domainId).length === 0;
    return isGlobalGuest && hasNoRoleInThisDomain;
  }

  public addToCurrentDomain(user: User) {
    this.onAddToDomain.emit(user);
    this.changeMode();
  }

  public changeMode() {
    this.onModeChange.emit(0);
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

  public searchUsers(search: string) {
    console.log(search)
    if (search === '') {
      this.filteredUsers = [];
    } else {
      if (this.allowedModes.find(v => v === ComponentMode.EDIT) !== undefined) {
        this.userService.getUserBySearch(search, this.domainId).subscribe(data => {
          this.filteredUsers = data;
          this.displayUsers = this.filteredUsers;
        })
      } else {
        // this.displayUsers = this.users;
      }
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
      roles = [Role.ROLE_GUEST, Role.ROLE_USER, Role.ROLE_DOMAIN_ADMIN];
    } else {
      // no roles
      roles = [];
    }
    return roles;
  }


  public changeUserRole(user: User, domainId: number, event: any) {
    console.warn(event);
    this.onUserRoleChange.emit({userId: user.id, domainId: domainId, role: event.value})
  }

  public checkUserIfIsCurrentUser(userName: string) {
    return this.authService.getUsername() === userName
  }
}

function roleConvert(role: string | Role ): Role {
  if (typeof role === 'string') {
    return Role[role];
  }
  return role;
}
