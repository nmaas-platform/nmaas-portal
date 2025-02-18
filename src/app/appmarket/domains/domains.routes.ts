import {Route} from '@angular/router';
import {DomainComponent, DomainsListComponent} from './index';
import {AuthGuard} from '../../auth/auth.guard';
import {RoleGuard} from '../../auth/role.guard';
import {ComponentMode} from '../../shared/common/componentmode';
import {DomainuploadComponent} from '../bulkDeployment/domainDeployment/domainupload/domainupload.component';
import {DomainGroupsComponent} from './domain-groups/domain-groups.component';
import {DomainGroupViewComponent} from './domain-group-view/domain-group-view.component';
import {BulkDomainListComponent} from '../bulkDeployment/bulk-domain-list/bulk-domain-list.component';
import {BulkViewComponent} from '../bulkDeployment/bulk-view/bulk-view.component';
import { DomainAnnotationsComponent } from './domain-annotations/domain-annotations.component';

export const DomainsRoutes: Route[] = [
    {
        path: 'domains', component: DomainsListComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_DOMAIN_ADMIN', 'ROLE_OPERATOR', 'ROLE_VL_DOMAIN_ADMIN', 'ROLE_VL_MANAGER']}
    },
    {
        path: 'domains/add', component: DomainComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.CREATE, roles: ['ROLE_SYSTEM_ADMIN']}
    },
    {
        path: 'domains/annotations', component: DomainAnnotationsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.CREATE, roles: ['ROLE_SYSTEM_ADMIN']}
    },
    {
        path: 'domains/view/:id', component: DomainComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_DOMAIN_ADMIN', 'ROLE_OPERATOR', 'ROLE_VL_DOMAIN_ADMIN']}
    },
    {
        path: 'domains/edit/:id', component: DomainComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.EDIT, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_OPERATOR']}
    },
    {
        path: 'domains/groups', component: DomainGroupsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_VL_MANAGER']}
    },
    {
        path: 'domains/groups/add', component: DomainGroupViewComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.CREATE, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_VL_MANAGER']}
    },
    {
        path: 'domains/groups/:id', component: DomainGroupViewComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_VL_MANAGER']}
    },
    {
        path: 'domains/bulks/new', component: DomainuploadComponent,
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_VL_MANAGER']}},
    {
        path: 'domains/bulks', component: BulkDomainListComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_VL_MANAGER']}
    },
    {
        path: 'domains/bulks/:id', component: BulkViewComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_VL_MANAGER']}
    }
];
