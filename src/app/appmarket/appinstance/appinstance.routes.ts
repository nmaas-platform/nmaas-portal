import {Route} from '@angular/router';
import {AppInstanceComponent, AppInstanceListComponent} from './index';
import {AppInstanceShellViewComponent} from './appinstance-shell-view/appinstance-shell-view.component';
import {AppLogAccessComponent} from './app-log-access/app-log-access.component';

export const AppInstanceRoutes: Route[] = [
    {path: 'instances', component: AppInstanceListComponent},
    {path: 'instances/:id', component: AppInstanceComponent},
    {path: 'instances/:id/shell/:podname', component: AppInstanceShellViewComponent},
    {path: 'instances/:id/logs', component: AppLogAccessComponent},
];
