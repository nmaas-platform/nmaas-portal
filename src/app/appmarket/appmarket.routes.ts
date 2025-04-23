import {Route} from '@angular/router';
import {AppMarketComponent} from './appmarket.component';
import {AppDetailsComponent} from './appdetails/index';

import {AuthGuard} from '../auth/auth.guard';

import {AppListRoutes} from './applist/applist.routes';
import {AppInstanceRoutes} from './appinstance/appinstance.routes';
import {DomainsRoutes} from './domains/domains.routes';
import {UsersRoutes} from './users/users.routes';
import {ClustersRoutes} from './admin/clusters/clusters.routes';
import {ConfigurationRoutes} from './admin/configuration/configuration.routes';
import {MonitorRoutes} from './admin/monitor/monitor.routes';
import {AppManagementRoutes} from './appmanagement/app-management.routes';
import {LanguageManagementRoutes} from './admin/languagemanagement/languagemanagement.routes';
import { AdminLeftMenuComponent } from '../shared/admin-left-menu/admin-left-menu.component';
import { AdminDashboardComponent } from '../shared/admin-dashboard/admin-dashboard.component';

export const AppMarketRoutes: Route[] = [
    {
      path: '',
      component: AppMarketComponent,
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
      children: [
        ...AppListRoutes,
        ...AppInstanceRoutes,
          { path: 'apps/:id', component: AppDetailsComponent },

      ]
    },
    {
      path: 'admin',
      component: AdminLeftMenuComponent,
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
      children: [
        {
          path: '',
          redirectTo: '/admin/dashboard',
          pathMatch: 'full'
        },
        {
          path: 'dashboard',
          component: AdminDashboardComponent
        },
        ...DomainsRoutes,
        ...UsersRoutes,
        ...ClustersRoutes,
        ...ConfigurationRoutes,
        ...MonitorRoutes,
        ...AppManagementRoutes,
        ...LanguageManagementRoutes,
      ]
    }
];
