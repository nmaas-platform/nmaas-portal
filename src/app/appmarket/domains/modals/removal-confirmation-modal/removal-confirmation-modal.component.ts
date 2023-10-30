import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../../shared';

@Component({
    selector: 'app-removal-confirmation-modal',
    templateUrl: './removal-confirmation-modal.component.html',
    styleUrls: []
})
export class RemovalConfirmationModalComponent {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @Input()
    public header: string;

    @Input()
    public description: string;

    @Input()
    public disabledButtonWarning: string;

    @Output()
    public onConfirm: EventEmitter<void> = new EventEmitter<void>();

    @Input()
    public object: any;
    @Input()
    public disableButton: boolean;

    public show() {
        this.modal.show();
    }

    public hide() {
        this.modal.hide();
    }

    removeDomain() {
        this.onConfirm.emit()
        this.hide()
    }
}
