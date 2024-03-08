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
import {ModalComponent} from '../../../shared';
import {RemovalConfirmationModalComponent} from '../../domains/modals/removal-confirmation-modal/removal-confirmation-modal.component';
import {ApplicationDTO} from '../../../model/application-dto';

@Component({
    selector: 'nmaas-appmanagementlist',
    templateUrl: './appmanagementlist.component.html',
    styleUrls: ['./appmanagementlist.component.css']
})
export class AppManagementListComponent implements OnInit {

    @ViewChild(AppChangeStateModalComponent, { static: true })
    public appChangeStateModalComponent: AppChangeStateModalComponent;

    @ViewChild(RemovalConfirmationModalComponent)
    public confirmRemovalModal: ModalComponent;

    public selectedAppName = '';
    public selectedVersion: ApplicationVersion = new ApplicationVersion();

    public apps: ApplicationBase[] = [];

    public versionRowVisible: boolean[] = []

    public filteredApps: ApplicationBase[] = [];

    public appToRemove: ApplicationBase
    public hasRunningInstances: boolean;
    public blobUrl;

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
            this.filteredApps = val;
            this.versionRowVisible = new Array(val.length).fill(false);
        });
    }

    public searchApp(value: string) {
        const result = [];
        if (value !== null && value !== '') {
            this.apps.forEach(app => {
                if (app.name.toLowerCase().includes(value.toLowerCase())) {
                    result.push(app)
                }
            })
            this.apps = result;
        } else {
            this.apps = this.filteredApps
        }
    }

    public removeApp(id: number): void {
        this.appsService.deleteAppBase(id).subscribe({
            next: () => this.refresh(),
            error: err => console.error(err)
        });
    }

    public openRemovalModal(app: ApplicationBase): void {
        this.appsService.hasRunningInstances(app.id).subscribe({
            next: hasRunningInstances => {
                this.hasRunningInstances = hasRunningInstances;
                this.appToRemove = app;
                this.confirmRemovalModal.show();
            },
            error: err => console.error(err)
        })
    }

    public getApplicationInfoJSON(id: number) {
        this.appsService.getApplicationDTO(id).subscribe( appDTO => {
            appDTO = this.deleteIDsFields(appDTO);
           let blob = new Blob([JSON.stringify(appDTO, null, 4)], {type: 'application/json'})
            this.blobUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = this.blobUrl;
            a.download = `${appDTO.applicationBase.name}-${appDTO.application.version}.json`
            a.click();
            window.URL.revokeObjectURL(this.blobUrl);
            a.remove();
        })
    }

    private deleteIDsFields(app: ApplicationDTO) {
        app.applicationBase.id = null;
        app.applicationBase.owner = null;
        app.applicationBase.tags.forEach(tag => {
            tag.id = null;
        })
        app.applicationBase.versions = null;
        app.application.id = null;
        if (app.application.configWizardTemplate !== null) {
            app.application.configWizardTemplate.id = null;
        }
        if (app.application.configUpdateWizardTemplate !== null) {
            app.application.configUpdateWizardTemplate.id = null;
        }
        if (app.application.appDeploymentSpec !== null) {
            app.application.appDeploymentSpec.id = null;
            if (app.application.appDeploymentSpec.kubernetesTemplate !== null) {
                app.application.appDeploymentSpec.kubernetesTemplate.id = null;
                app.application.appDeploymentSpec.kubernetesTemplate.chart.id = null;
            }
            app.application.appDeploymentSpec.storageVolumes.forEach(storageVolume => {
                storageVolume.id = null;
            })
            app.application.appDeploymentSpec.accessMethods.forEach(accessMethod => {
                accessMethod.id = null;
            })
        }
        if (app.application.appConfigurationSpec !== null) {
            app.application.appConfigurationSpec.id = null;
            app.application.appConfigurationSpec.templates.forEach(template => {
                template.id = null;
                template.applicationId = null;
            })
        }
        return app;
    }
}
