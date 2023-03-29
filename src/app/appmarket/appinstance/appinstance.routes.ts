import { Route } from '@angular/router';
import { AppInstanceComponent } from './index';
import { AppInstanceListComponent } from './index';
import {AppInstanceShellViewComponent} from './appinstance-shell-view/appinstance-shell-view.component';
import {AppdeploymentComponent} from '../bulkDeployment/appDeployment/appchoose/appdeployment.component';
import {AppnavigatorComponent} from '../bulkDeployment/appDeployment/appnavigator/appnavigator.component';
import {AppuploadComponent} from '../bulkDeployment/appDeployment/appupload/appupload.component';
import {AppsummaryComponent} from '../bulkDeployment/appDeployment/appsummary/appsummary.component';

export const AppInstanceRoutes: Route[] = [
    { path: 'instances', component: AppInstanceListComponent },
    { path: 'instances/deploy', component: AppnavigatorComponent, children: [
            {path: '', redirectTo: 'select', pathMatch: 'full'},
            {path: 'select', component: AppdeploymentComponent},
            {path: 'upload', component: AppuploadComponent},
            {path: 'summary', component: AppsummaryComponent}
        ]},
    { path: 'instances/:id', component: AppInstanceComponent },
    { path: 'instances/:id/shell/:podname', component: AppInstanceShellViewComponent },
];
