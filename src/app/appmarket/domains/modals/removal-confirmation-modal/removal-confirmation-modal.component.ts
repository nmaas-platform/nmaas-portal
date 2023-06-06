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

  constructor(private readonly domainService: DomainService) { }

  public show() {
    this.modal.show();
  }

  public hide() {
    this.modal.hide();
    this.onConfirm.emit()
  }

  removeDomain() {
    this.domainService.remove(this.domain.id, true).subscribe({
      next: () => this.hide(),
      error: err => console.error(err)
    });
  }
}
