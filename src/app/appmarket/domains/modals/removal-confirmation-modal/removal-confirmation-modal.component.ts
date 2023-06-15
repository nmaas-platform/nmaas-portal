import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../../../../shared";
import {Domain} from "../../../../model/domain";
import {DomainService} from "../../../../service";

@Component({
  selector: 'app-removal-confirmation-modal',
  templateUrl: './removal-confirmation-modal.component.html',
  styleUrls: ['./removal-confirmation-modal.component.css']
})
export class RemovalConfirmationModalComponent {

  @ViewChild(ModalComponent, { static: true })
  public readonly modal: ModalComponent;

  @Input()
  public domain: Domain;

  @Output()
  public onConfirm: EventEmitter<void> = new EventEmitter<void>();

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
