import {Route} from '@angular/router';
import {ClusterDetailsComponent} from './index';
import {AuthGuard} from '../../../auth/auth.guard';
import {RoleGuard} from '../../../auth/role.guard';
import {ComponentMode} from '../../../shared/common/componentmode';
import { ClusterManagerComponent } from '../../../shared/admin/clusters/manager/manager.component';
import { ClusterManagerDetailsComponent } from '../../../shared/admin/clusters/managerdetails/managerdetails.component';

export const ClustersRoutes: Route[] = [
    { path: 'admin/clusters', component: ClusterDetailsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_OPERATOR']}},
    { path: 'admin/clusters/view', component: ClusterDetailsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_OPERATOR']}},
    { path: 'admin/manage/clusters', component: ClusterManagerComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_OPERATOR']}},
    { path: 'admin/manage/clusters/:id', component: ClusterManagerDetailsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.EDIT, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_OPERATOR']}},
];
