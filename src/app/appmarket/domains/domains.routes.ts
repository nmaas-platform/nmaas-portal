import {Route} from '@angular/router';
import {DomainComponent, DomainsListComponent} from './index';
import {AuthGuard} from '../../auth/auth.guard';
import {RoleGuard} from '../../auth/role.guard';
import {ComponentMode} from '../../shared/common/componentmode';
import {DomainuploadComponent} from '../bulkDeployment/domainDeployment/domainupload/domainupload.component';
import {DomainsummaryComponent} from '../bulkDeployment/domainDeployment/domainsummary/domainsummary.component';
import {DomainNavigatorComponent} from '../bulkDeployment/domainDeployment/domainnavigator/domain-navigator.component';
import {DomainGroupsComponent} from './domain-groups/domain-groups.component';
import {DomainGroupViewComponent} from './domain-group-view/domain-group-view.component';
import {BulkDomainListComponent} from '../bulkDeployment/bulk-domain-list/bulk-domain-list.component';
import {BulkViewComponent} from '../bulkDeployment/bulk-view/bulk-view.component';

export const DomainsRoutes: Route[] = [
  {path: 'admin/domains', component: DomainsListComponent, canActivate: [AuthGuard, RoleGuard],
                        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_DOMAIN_ADMIN', 'ROLE_OPERATOR']}},
  {path: 'admin/domains/add', component: DomainComponent, canActivate: [AuthGuard, RoleGuard],
                        data: {mode: ComponentMode.CREATE, roles: ['ROLE_SYSTEM_ADMIN']}},
  {path: 'admin/domains/view/:id', component: DomainComponent, canActivate: [AuthGuard, RoleGuard],
                        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_DOMAIN_ADMIN', 'ROLE_OPERATOR']}},
  {path: 'admin/domains/edit/:id', component: DomainComponent, canActivate: [AuthGuard, RoleGuard],
                        data: {mode: ComponentMode.EDIT, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_OPERATOR']}},
    { path: 'admin/domains/deploy', component: DomainNavigatorComponent, children: [
            {path: '', redirectTo: 'upload', pathMatch: 'full'},
            {path: 'upload', component: DomainuploadComponent},
            {path: 'summary', component: DomainsummaryComponent}
        ]},
    {path: 'admin/domains/groups', component: DomainGroupsComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN']}},
    {path: 'admin/domains/groups/add', component: DomainGroupViewComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.CREATE, roles: ['ROLE_SYSTEM_ADMIN']}},
    {path: 'admin/domains/groups/:id', component: DomainGroupViewComponent, canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN']}},
    {path: 'admin/domains/bulks', component: BulkDomainListComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN']}},
    {path: 'admin/domains/bulks/:id', component: BulkViewComponent, canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN']}}
];
