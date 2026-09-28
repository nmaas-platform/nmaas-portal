import {Route} from '@angular/router';
import {VariableListComponent} from './variablelist/variablelist.component';
import {AuthGuard} from '../../../auth/auth.guard';
import {RoleGuard} from '../../../auth/role.guard';

export const VariableRoutes: Route[] = [
    {path: 'variables', component: VariableListComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROLE_SYSTEM_ADMIN']}},
];
