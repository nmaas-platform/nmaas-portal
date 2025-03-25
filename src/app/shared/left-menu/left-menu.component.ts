import { Component, OnInit } from '@angular/core';
import { ToastContainerComponent, ToastMode } from '../toast-container/toast-container.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.css'
})
export class LeftMenuComponent  implements OnInit {
  items: MenuItem[];
  toggleAdmin = false;
  currentUrl : string ;
  isCollapsed = false;

  constructor(private toast: ToastContainerComponent,
              public router: Router,
              private readonly activeRoute: ActivatedRoute,) {
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
    const storedState = sessionStorage.getItem('menuCollapsed');
    this.isCollapsed = storedState === 'true';
  }

  public ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        console.log('Aktualny URL:', this.currentUrl);
        if(this.currentUrl.includes('admin')) {
          this.toggleAdmin = true;
        }
      }
    })
    console.log("test left menu ")
    const newWidth = this.isCollapsed ? '100px' : '300px';
    document.documentElement.style.setProperty('--left-panel-width', newWidth);
  }

  public showToastTest() {
    this.toast.show("Test test", ToastMode.DANGER, "HEADER")
  }
  adminPanel() {
    this.toggleAdmin = !this.toggleAdmin;
  }
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
    const newWidth = this.isCollapsed ? '100px' : '300px';
    document.documentElement.style.setProperty('--left-panel-width', newWidth);
    sessionStorage.setItem('menuCollapsed', this.isCollapsed.toString());
  }

}
