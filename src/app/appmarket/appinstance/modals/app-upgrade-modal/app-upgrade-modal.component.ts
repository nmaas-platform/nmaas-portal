import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from "../../../../shared/modal";
import {AppInstanceService} from "../../../../service";
import {AppInstanceUpgradeInfo} from "../../../../model/app-instance";

@Component({
  selector: 'nmaas-modal-app-upgrade',
  templateUrl: './app-upgrade-modal.component.html',
  styleUrls: ['./app-upgrade-modal.component.css'],
    providers:[ModalComponent]
})
export class AppUpgradeModalComponent implements OnInit {

    @ViewChild(ModalComponent, { static: true })
    public readonly modal: ModalComponent;

    @Input()
    private appInstanceId: number;

    @Input()
    public currentApplicationVersion: string;

    @Input()
    public upgradeInfo: AppInstanceUpgradeInfo;

    constructor(private router: Router,
                private appInstanceService: AppInstanceService) {
    }

    ngOnInit() { }

    public show() {
        this.modal.show();
    }

    public upgrade() {
        this.appInstanceService.upgradeAppInstance(this.appInstanceId, this.upgradeInfo.applicationId).subscribe(
            () => this.router.navigateByUrl('/instances'));
    }
}
