import {AuthService} from '../../../auth/auth.service';
import {User} from '../../../model';
import {Role} from '../../../model/userrole';
import {DomainService, UserService} from '../../../service';
import {UserDataService} from '../../../service/userdata.service';
import {Component, OnInit} from '@angular/core';
import {ComponentMode} from '../../../shared';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-userslist',
    templateUrl: './userslist.component.html',
    styleUrls: []
})
export class UsersListComponent implements OnInit {

    public ComponentMode = ComponentMode;

    public domainId: number;

    public allUsers: User[] = [];
    public usersToAdd: User[] = [];

    public isInAddToDomainMode = false;

    public domainMode: boolean;

    constructor(protected authService: AuthService,
                protected userService: UserService,
                protected domainService: DomainService,
                protected userDataService: UserDataService,
                private router: Router,
                private route: ActivatedRoute,
                private location: Location) {
    }


    ngOnInit() {
        this.domainMode = false;
        this.userDataService.selectedDomainId.subscribe((domainId) => this.update(domainId));
    }

    public update(domainId: number): void {
        console.log('Update users for domainId= ' + domainId);
        if (domainId == null || domainId === 0) {
            this.domainId = undefined;
        } else {
            this.domainId = domainId;
        }

        let users: Observable<User[]> = null;

        if (this.authService.hasRole(Role[Role.ROLE_SYSTEM_ADMIN]) && this.domainId != null) {
            users = this.userService.getDomainUsersAsAdmin(this.domainId);
        } else if (this.authService.hasRole(Role[Role.ROLE_SYSTEM_ADMIN])) {
            users = this.userService.getAll(this.domainId);
        } else if (this.domainId != null && (this.authService.hasDomainRole(this.domainId, Role[Role.ROLE_DOMAIN_ADMIN]) || this.authService.hasDomainRole(this.domainId, Role[Role.ROLE_VL_DOMAIN_ADMIN]))) {
            this.domainMode = true;
            users = this.userService.getAll(this.domainId);
        } else {
            users = of<User[]>([]);
        }
        // sort default user list by username
        users = users.pipe(
            map(userList => {
                userList.sort((a, b) => a.username.localeCompare(b.username));
                return userList;
            })
        )

        users.subscribe((all) => {
            this.allUsers = all;
            /* parse date strings to date objects */
            for (const u of this.allUsers) {
                if (u.firstLoginDate) {
                    u.firstLoginDate = new Date(u.firstLoginDate)
                }
                if (u.lastSuccessfulLoginDate) {
                    u.lastSuccessfulLoginDate = new Date(u.lastSuccessfulLoginDate)
                }
            }
        });
    }

    public onUserView($event): void {
        this.router.navigate(['/admin/users/view/', $event]);
    }

    public onRemoveRole($event): void {
        this.userService.removeRole(
            $event.id, $event.roles.find(value => value.domainId === this.domainId).role, this.domainId).subscribe(
            () => this.update(this.domainId)
        )
    }

    public onUserDelete($event): void {
        this.userService.deleteOne($event.id).subscribe(
            () => this.update(this.domainId)
        )
    }

    public onUserAddToDomain($event): void {
        this.userService.addRole($event.id, Role.ROLE_USER, this.domainId).subscribe(() => this.update(this.domainId))
    }

    public onModeChange($event): void {
        this.isInAddToDomainMode = !this.isInAddToDomainMode;
    }

    public userRoleAsEnum(role: string | Role): Role {
        if (typeof role === 'string') {
            return Role[role];
        }
        return role;
    }

    public onUserRoleChange(event: any) {
        if (event.role !== null) {
            this.userService.addRole(event.userId, event.role, event.domainId).subscribe(() => this.update(this.domainId))
        } else {
            const foundUser = this.allUsers.find(user => user.id === event.userId);
            this.onRemoveRole({id: event.userId, roles: foundUser.roles})
        }
    }
}
