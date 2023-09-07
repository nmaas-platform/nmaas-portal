import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../shared';

@Component({
    selector: 'modal-guest-user',
    templateUrl: './modal-guest-user.component.html',
    styleUrls: []
})
export class ModalGuestUserComponent implements OnInit {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    ngOnInit() {
        this.modal.setModalType('info');
        this.modal.setStatusOfIcons(true);
    }

}
