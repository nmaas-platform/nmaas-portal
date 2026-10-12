import {Route} from '@angular/router';
import {AuthGuard} from '../../auth/auth.guard';
import {RoleGuard} from '../../auth/role.guard';
import {AppManagementListComponent} from './app-management-list/appmanagementlist.component';
import {AppCreateWizardComponent} from './app-create-wizard/app-create-wizard.component';
import {ComponentMode} from '../../shared';
import {AppPreviewComponent} from './app-preview/apppreview.component';
import {AppVersionCreateWizardComponent} from './app-version-create-wizard/app-version-create-wizard.component';
import {BulkAppListComponent} from '../bulkDeployment/bulk-app-list/bulk-app-list.component';
import {BulkViewComponent} from '../bulkDeployment/bulk-view/bulk-view.component';
import {AppnavigatorComponent} from '../bulkDeployment/appDeployment/appnavigator/appnavigator.component';
import {AppdeploymentComponent} from '../bulkDeployment/appDeployment/appSelection/appdeployment.component';
import {AppuploadComponent} from '../bulkDeployment/appDeployment/appupload/appupload.component';
import {AppsummaryComponent} from '../bulkDeployment/appDeployment/appsummary/appsummary.component';
import {BundleListComponent} from '../bundle/bundle-list/bundle-list.component';
import {BundleDetailsComponent} from '../bundle/bundle-details/bundle-details.component';

export const AppManagementRoutes: Route[] = [
    {
        path: 'apps',
        component: AppManagementListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_TOOL_MANAGER']}
    },
    {
        path: 'apps/create',
        component: AppCreateWizardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_TOOL_MANAGER'], mode: ComponentMode.CREATE}
    },
    {
        path: 'apps/create/version/:name',
        component: AppVersionCreateWizardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_TOOL_MANAGER'], mode: ComponentMode.CREATE}
    },
    {
        path: 'apps/edit/:id',
        component: AppCreateWizardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_TOOL_MANAGER'], mode: ComponentMode.EDIT}
    },
    {
        path: 'apps/edit/version/:id',
        component: AppVersionCreateWizardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_TOOL_MANAGER'], mode: ComponentMode.EDIT}
    },
    {
        path: 'apps/view/:id',
        component: AppPreviewComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_TOOL_MANAGER']}
    },
    {
        path: 'apps/bulks',
        component: BulkAppListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_GROUP_MANAGER']}
    },
    { path: 'apps/bulks/new',
        component: AppnavigatorComponent,
        children: [
            {path: '', redirectTo: 'select', pathMatch: 'full'},
            {path: 'select', component: AppdeploymentComponent},
            {path: 'upload', component: AppuploadComponent},
            {path: 'summary', component: AppsummaryComponent}
        ]},
    {
        path: 'apps/bulks/:id',
        component: BulkViewComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_GROUP_MANAGER' ]}
    },
    {
        path: 'apps/bundles',
        component: BundleListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_GROUP_MANAGER' ]}
    },
    {
        path: 'apps/bundles/view/:id',
        component: BundleDetailsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.VIEW, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_GROUP_MANAGER' ]}
    },
    {
        path: 'apps/bundles/edit/:id',
        component: BundleDetailsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.EDIT, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_GROUP_MANAGER' ]}
    },
    {
        path: 'apps/bundles/create',
        component: BundleDetailsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {mode: ComponentMode.CREATE, roles: ['ROLE_SYSTEM_ADMIN', 'ROLE_GROUP_MANAGER' ]}
    }
];
