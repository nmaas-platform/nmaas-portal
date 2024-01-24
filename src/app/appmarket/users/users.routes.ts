import {Route} from '@angular/router';
import {UserDetailsComponent, UsersListComponent} from './index';
import {AuthGuard} from '../../auth/auth.guard';
import {RoleGuard} from '../../auth/role.guard';
import {ComponentMode} from '../../shared/common/componentmode';

export const UsersRoutes: Route[] = [
    { path: 'admin/users', component: UsersListComponent, canActivate: [AuthGuard, RoleGuard],
                      data: {roles: ['ROLE_SYSTEM_ADMIN']}},
    { path: 'admin/users/view/:id', component: UserDetailsComponent, canActivate: [AuthGuard, RoleGuard],
                      data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN']} },
    { path: 'domain/users', component: UsersListComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_DOMAIN_ADMIN', 'ROLE_VL_MANAGER']}},
];
