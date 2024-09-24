import {Component, ViewChild} from '@angular/core';
import {ApplicationBase} from '../../../model/application-base';
import {AppsService, UserService} from '../../../service';
import {User} from '../../../model';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Role} from '../../../model/userrole';
import {ModalComponent} from '../../../shared';

function roleConvert(role: string | Role): Role {
  if (typeof role === 'string') {
    return Role[role];
  }
  return role;
}

function userHasRequiredRoles(user: User, roles: Role[]): boolean {
  return user.roles
      .map(role => roleConvert(role.role))
      .find(role => roles.find(r => r === role) !== undefined) !== undefined
}

@Component({
  selector: 'app-app-change-owner-modal',
  templateUrl: './app-change-owner-modal.component.html',
  styleUrls: []
})
export class AppChangeOwnerModalComponent {

  @ViewChild(ModalComponent, { static: true })
  public readonly modal: ModalComponent;

  public applicationBase: ApplicationBase | undefined = undefined;

  public selectedUsername: string | undefined = undefined;

  public readonly availableUsers: Observable<User[]> = this.userService.getAll().pipe(
      catchError(_ => []),
      map(users => users.filter(user => userHasRequiredRoles(user, [Role.ROLE_TOOL_MANAGER, Role.ROLE_SYSTEM_ADMIN]))),
  )

  constructor(
      private readonly appsService: AppsService,
      private readonly userService: UserService,
  ) { }

  public show(applicationBase: ApplicationBase): void {
    this.applicationBase = applicationBase;
    this.selectedUsername = applicationBase.owner;
    this.modal.show();
  }

  public submit(): void {
    this.applicationBase.owner = this.selectedUsername;
    this.appsService.updateApplicationBaseOwner(this.applicationBase).subscribe();
    this.selectedUsername = undefined;
    this.applicationBase = undefined;
    this.modal.hide();
  }

}
