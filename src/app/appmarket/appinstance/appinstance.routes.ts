import { Route } from '@angular/router';
import { AppInstanceComponent } from './index';
import { AppInstanceListComponent } from './index';
import {AppInstanceShellViewComponent} from './appinstance-shell-view/appinstance-shell-view.component';
import {AppdeploymentComponent} from '../appdeployment/appchoose/appdeployment.component';
import {AppnavigatorComponent} from '../appdeployment/appnavigator/appnavigator.component';
import {AppuploadComponent} from '../appdeployment/appupload/appupload.component';
import {AppsummaryComponent} from '../appdeployment/appsummary/appsummary.component';

export const AppInstanceRoutes: Route[] = [
    { path: 'instances', component: AppInstanceListComponent },
    { path: 'instances/:id', component: AppInstanceComponent },
    { path: 'instances/:id/shell/:podname', component: AppInstanceShellViewComponent },
    {
        path: 'deploy', component: AppnavigatorComponent, children: [
            {path: '', redirectTo: 'select', pathMatch: 'full'},
            {path: 'select', component: AppdeploymentComponent},
            {path: 'upload', component: AppuploadComponent},
            {path: 'summary', component: AppsummaryComponent}
        ]
    }
];
