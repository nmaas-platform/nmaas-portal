import {Component, Input, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../../shared';
import {PodInfo} from '../../../../model/podinfo';

@Component({
    selector: 'app-select-pod-modal',
    templateUrl: './select-pod-modal.component.html',
    styleUrls: []
})
export class SelectPodModalComponent {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @Input()
    public url = '';

    @Input()
    public pods: PodInfo[] = []

    public show() {
        this.modal.show();
    }

    public hide() {
        this.modal.hide();
    }

}
