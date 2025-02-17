import { Component, OnInit } from '@angular/core';
import { ToastContainerComponent, ToastMode } from '../toast-container/toast-container.component';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.css'
})
export class LeftMenuComponent  implements OnInit {
  items: MenuItem[];
  toggleAdmin = false;

  constructor(private toast: ToastContainerComponent,
              public router: Router) {
    this.items = [
      {
        label: 'Profile',
        routerLink: ['/profile']
      },
      {
        label: 'About',
        routerLink: ['/about']
      },
      {
        label: 'Logout',
        routerLink: ['/logout']
      }
    ]
  }

  public ngOnInit(): void {
      console.log("test left menu ")
  }

  public showToastTest() {
    this.toast.show("Test test", ToastMode.DANGER, "HEADER")
  }
  adminPanel() {
    this.toggleAdmin = !this.toggleAdmin;
  }

}
