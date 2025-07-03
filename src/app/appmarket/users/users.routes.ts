import { Route } from '@angular/router';
import { UserDetailsComponent } from './index';
import { AuthGuard } from '../../auth/auth.guard';
import { RoleGuard } from '../../auth/role.guard';
import { ComponentMode } from '../../shared/common/componentmode';
import { UsersListAdminComponent } from '../../shared';
import { UserDomainListComponent } from '../../shared/users/user-domain/user-domain-list.component';

export const UsersRoutes: Route[] = [
    {
        path: 'users', component: UsersListAdminComponent, canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ROLE_SYSTEM_ADMIN'] }
    },
    {
        path: 'users/view/:id', component: UserDetailsComponent, canActivate: [AuthGuard, RoleGuard],
        data: { mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN'] }
    },
    {
        path: 'domain/users', component: UserDomainListComponent, canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ROLE_DOMAIN_ADMIN', 'ROLE_GROUP_MANAGER'] }
    },
];
