import { Component, OnInit } from '@angular/core';
import { ToastContainerComponent, ToastMode } from '../toast-container/toast-container.component';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.css'
})
export class LeftMenuComponent  implements OnInit{

  constructor(private toast: ToastContainerComponent) {

  }

  public ngOnInit(): void {
      console.log("test left menu ")
  }

  public showToastTest() {
    this.toast.show("Test test", ToastMode.DANGER, "HEADER")
  }

}
