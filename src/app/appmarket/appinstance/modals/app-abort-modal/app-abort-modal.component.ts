import {Component, Input, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../../shared';
import {AppInstanceService} from '../../../../service';

@Component({
    selector: 'nmaas-modal-app-abort',
    templateUrl: './app-abort-modal.component.html',
    styleUrls: [],
    providers: [ModalComponent]
})
export class AppAbortModalComponent {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @Input()
    private appInstanceId: number;

    @Input()
    private domainId: number;

    constructor(private appInstanceService: AppInstanceService) {
    }

    public show() {
        this.modal.show();
    }

    public abort() {
        this.appInstanceService.removeAppInstance(this.appInstanceId).subscribe(() => this.modal.hide());
    }
}
