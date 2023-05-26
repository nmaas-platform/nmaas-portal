import {Component, OnInit, ViewChild} from '@angular/core';
import {AppsService} from '../../../service';
import {Router} from '@angular/router';
import {ApplicationState, parseApplicationState} from '../../../model/application-state';
import {AuthService} from '../../../auth/auth.service';
import {AppChangeStateModalComponent} from '../app-change-state-modal/appchangestatemodal.component';
import {ApplicationVersion} from '../../../model/application-version';
import {map} from 'rxjs/operators';
import {ApplicationBase} from '../../../model/application-base';
import * as semver from 'semver'

@Component({
    selector: 'nmaas-appmanagementlist',
    templateUrl: './appmanagementlist.component.html',
    styleUrls: ['./appmanagementlist.component.css']
})
export class AppManagementListComponent implements OnInit {

    @ViewChild(AppChangeStateModalComponent, { static: true })
    public appChangeStateModalComponent: AppChangeStateModalComponent;


    public selectedAppName = '';
    public selectedVersion: ApplicationVersion = new ApplicationVersion();

    public apps: ApplicationBase[] = [];

    public versionRowVisible: boolean[] = []

    constructor(public appsService: AppsService,
                public router: Router,
                public authService: AuthService) {
    }

    ngOnInit() {
        this.refresh();
    }

    public getStateAsString(state: any): string {
        return typeof state === 'string' && isNaN(Number(state.toString())) ? state : ApplicationState[state];
    }

    public showModal(event, app: ApplicationBase, appVersion: ApplicationVersion): void {
        event.stopPropagation()
        this.selectedAppName = app.name;
        this.selectedVersion = appVersion;
        this.appChangeStateModalComponent.show();
    }

    public clickTableRow(i: number) {
        this.versionRowVisible[i] = !this.versionRowVisible[i];
    }

    public isAnySubtableVisible(): boolean {
        if (this.versionRowVisible.length === 0) {
            return false;
        }
        return this.versionRowVisible.reduce((prev: boolean, curr: boolean, i: number, array: boolean[]) => prev && curr);
    }

    public appVersionCompare(a: ApplicationVersion, b: ApplicationVersion): number {
        // defaults version that cannot be parsed to `0.0.0`
        return semver.compare(semver.coerce(a.version) || '0.0.0', semver.coerce(b.version) || '0.0.0')
    }

    public refresh() {
        this.appsService.getAllApplicationBase().pipe(
            map(apps => {
                return apps
                    .map(app => {
                        // filter out deleted app versions
                        app.versions = app.versions.filter(av => parseApplicationState(av.state) !== ApplicationState.DELETED)
                        return app
                    })
                    // filter out apps with no versions
                    .filter(app => app.versions.length >= 1)
                    // sort by lowercase name
                    .sort((a, b) => {
                        if (a.name.toLowerCase() === b.name.toLowerCase()) {
                            return 0;
                        }
                        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1;
                    })
            })
        ).subscribe(val => {
            this.apps = val;
            this.versionRowVisible = new Array(val.length).fill(false);
        });
    }

}
