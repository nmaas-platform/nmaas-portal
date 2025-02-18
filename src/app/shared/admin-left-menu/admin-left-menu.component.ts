import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToastContainerComponent } from '../toast-container/toast-container.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-left-menu',
  templateUrl: './admin-left-menu.component.html',
  styleUrl: './admin-left-menu.component.css'
})
export class AdminLeftMenuComponent {

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

}
