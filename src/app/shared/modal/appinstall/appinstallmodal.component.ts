import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {ModalComponent} from '..';
import {AppInstanceService, DomainService} from '../../../service';
import {UserDataService} from '../../../service/userdata.service';
import {Domain} from '../../../model/domain';
import {ApplicationBase} from '../../../model/application-base';
import {ApplicationState} from '../../../model/application-state';

@Component({
    selector: 'nmaas-modal-app-install',
    templateUrl: './appinstallmodal.component.html',
    styleUrls: ['./appinstallmodal.component.css'],
})
export class AppInstallModalComponent implements OnInit {

    public ApplicationState = ApplicationState;

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @Input()
    app: ApplicationBase;

    @Input()
    domain: Domain;

    name: string;
    domainId: number;
    domainName: string;
    selectedAppVersion: number;
    autoUpgradesEnabled: boolean;
    error: string;

    public clicked = false;

    constructor(private appInstanceService: AppInstanceService,
                private domainService: DomainService,
                private userDataService: UserDataService,
                private router: Router) {
    }

    ngOnInit() {
        this.app.versions = this.app.versions.filter(version => this.getStateAsString(version.state) === 'ACTIVE');
        this.app.versions.sort((a, b) => a.version.localeCompare(b.version, undefined, {numeric: true}));
        this.app.versions.reverse();
        this.selectedAppVersion = this.app.versions[0].appVersionId;
        this.domainId = this.domain.id;
        this.domainName = this.domain.name;
        this.autoUpgradesEnabled = false;
    }

    public create(): void {
        if (this.domainId && this.app && this.app.id && !this.clicked) {
            this.clicked = true // block another method invocation
            this.appInstanceService.createAppInstance(this.domainId, this.selectedAppVersion, this.name, this.autoUpgradesEnabled).subscribe(
                instanceId => {
                    this.modal.hide();
                    this.router.navigate(['/instances', instanceId.id]);
                },
                err => {
                    this.error = err.message;
                    this.clicked = false; // in case of error unlock the button
                });
        }
    }

    public show(): void {
        this.modal.show();
    }

    public applicationState(state: ApplicationState | string): ApplicationState {
        if (typeof state === 'string') {
            return ApplicationState[state];
        }
        return state;
    }

    public getStateAsString(state: any): string {
        return typeof state === 'string' && isNaN(Number(state.toString())) ? state : ApplicationState[state];
    }

}
