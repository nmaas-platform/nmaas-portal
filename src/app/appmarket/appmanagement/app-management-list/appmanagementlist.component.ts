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
import {DomainGroup} from '../../../model/domaingroup';
import {Menu} from 'primeng/menu';
import {MenuItem, MenuItemCommandEvent} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'nmaas-appmanagementlist',
    templateUrl: './appmanagementlist.component.html',
    styleUrls: ['./appmanagementlist.component.css'],
    standalone: false
})
export class AppManagementListComponent implements OnInit {

    @ViewChild(AppChangeStateModalComponent, { static: true })
    public appChangeStateModalComponent: AppChangeStateModalComponent;

    @ViewChild(RemovalConfirmationModalComponent)
    public confirmRemovalModal: ModalComponent;

    @ViewChild('rowMenu') rowMenu!: Menu;
    rowMenuItems: MenuItem[] = [];
    rowVersionMenuItems: MenuItem[] = [];
    @ViewChild('versionRowMenu') versionRowMenu!: Menu;

    @ViewChild('appChangeOwnerModal') appChangeOwnerModal: any;
    @ViewChild('appAddJsonVersion') appAddJsonVersion: any;
    @ViewChild('appAddJson') appAddJson: any;

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
                public authService: AuthService,
                public translate: TranslateService) {
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
        const normalize = (v?: string) => {
            v = v || '0.0.0';
            return v.split(/[.\-]/).map(n => parseInt(n, 10) || 0);
        }

        const [a1, a2, a3, a4 = 0] = normalize(a.version);
        const [b1, b2, b3, b4 = 0] = normalize(b.version);

        return a1 - b1 || a2 - b2 || a3 - b3 || a4 - b4;
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
        if(app.versions.find(version => version.state !== ApplicationState.DELETED)) {
            this.hasRunningInstances = true;
        }
        this.appToRemove = app;
        this.confirmRemovalModal.show();
    }

    public getApplicationInfoJSONWithBase(id: number) {
        this.appsService.getApplicationBaseWithVersion(id).subscribe( appDTO => {
           let blob = new Blob([JSON.stringify(appDTO, null, 4)], {type: 'application/json'})
            this.blobUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = this.blobUrl;
            a.download = `${appDTO.applicationBase.name}.json`
            a.click();
            window.URL.revokeObjectURL(this.blobUrl);
            a.remove();
        })
    }

    public getApplicationInfoJSONWithoutBase(id: number) {
        this.appsService.getApplicationDTO(id).subscribe( appDTO => {
            appDTO = this.deleteIDsFields(appDTO);
            delete appDTO.applicationBase;
            console.log(appDTO);
           let blob = new Blob([JSON.stringify(appDTO, null, 4)], {type: 'application/json'})
            this.blobUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = this.blobUrl;
            a.download = `${appDTO.application.name}-${appDTO.application.version}.json`
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
    openRowMenu(event: Event, app: ApplicationBase) {

        this.rowMenuItems = [
            {
                label: this.translate.instant('APPS_MANAGEMENT.CHANGE_OWNER_BUTTON'),
                command: () => this.appChangeOwnerModal.show(app)
            },
            {
                label: this.translate.instant('APPS_MANAGEMENT.ADD_NEW_VERSION_BUTTON'),
                routerLink: ['/admin/apps/create/version', app?.name]
            },
            {
                label: this.translate.instant('APPS_MANAGEMENT.ADD_NEW_VERSION_BUTTON') + ' (JSON)',
                command: () => this.appAddJsonVersion.show()
            },
            {
                label: this.translate.instant('APPS_MANAGEMENT.EXPORT_JSON'),
                command: () => this.getApplicationInfoJSONWithBase(app?.id)
            },
            {
                label: this.translate.instant('APPS_MANAGEMENT.EDIT_BUTTON'),
                routerLink: ['/admin/apps/edit', app?.id]
            },
            {
                label: this.translate.instant('APPS_MANAGEMENT.DELETE_BUTTON'),
                command: () => this.openRemovalModal(app)
            },
        ];

        this.rowMenu.toggle(event);
    }
    openVersionRowMenu(event: Event, app: ApplicationBase, version: ApplicationVersion) {
        this.rowVersionMenuItems = [
            {
                label: this.translate.instant('APPS_MANAGEMENT.CHANGE_STATE_BUTTON'),
                visible: this.authService.hasRole('ROLE_SYSTEM_ADMIN') && this.getStateAsString(version?.state) !== 'DELETED',
                command: () => this.showModal(event, app, version)
            },
            {
                label: this.translate.instant('APPS_MANAGEMENT.EXPORT_JSON'),
                command: () => this.getApplicationInfoJSONWithoutBase(version?.appVersionId)
            },
            {
                label: this.translate.instant('APPS_MANAGEMENT.EDIT_BUTTON'),
                routerLink: ['/admin/apps/edit/version', version?.appVersionId]
            }
        ];

        this.versionRowMenu.toggle(event);
    }
}
