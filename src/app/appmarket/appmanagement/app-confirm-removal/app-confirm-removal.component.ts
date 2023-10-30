import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../../../shared";
import {ApplicationBase} from "../../../model/application-base";

@Component({
  selector: 'app-confirm-removal',
  templateUrl: './app-confirm-removal.component.html',
  styleUrls: ['./app-confirm-removal.component.css']
})
export class AppConfirmRemovalComponent {

  @ViewChild(ModalComponent, {static: true})
  public readonly modal: ModalComponent;

  @Output()
  public onConfirm: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public appBase: ApplicationBase

  @Input()
  public hasRunningInstances: boolean

  public show() {
    this.modal.show();
  }

  public hide() {
    this.modal.hide();
  }

  removeApp() {
    this.onConfirm.emit()
    this.hide()
  }

}





//
//
//              ___                         ___
//             /   \                       /   \
//           /
//         /
//       /
//     /
//   /
// /
// |
// \
//   \
