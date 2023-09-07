import {Component, Input, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from '../../../../shared';
import {AppInstanceService} from '../../../../service';
import {AppInstanceUpgradeInfo} from '../../../../model';

@Component({
    selector: 'nmaas-modal-app-upgrade',
    templateUrl: './app-upgrade-modal.component.html',
    styleUrls: [],
    providers: [ModalComponent]
})
export class AppUpgradeModalComponent {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @Input()
    private appInstanceId: number = undefined;

    @Input()
    public currentApplicationVersion: string = undefined;

    @Input()
    public upgradeInfo: AppInstanceUpgradeInfo = undefined;

    constructor(private router: Router,
                private appInstanceService: AppInstanceService) {
    }

    public show() {
        this.modal.show();
    }

    public upgrade() {
        this.appInstanceService.upgradeAppInstance(this.appInstanceId, this.upgradeInfo.applicationId).subscribe(
            () => this.router.navigateByUrl('/instances'));
    }
}
