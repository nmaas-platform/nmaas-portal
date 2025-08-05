import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerComponent, ToastMode } from '../toast-container/toast-container.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ModalNotificationSendComponent } from '../modal/modal-notification-send/modal-notification-send.component';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../../service/profile.service';

@Component({
    selector: 'app-left-menu',
    templateUrl: './left-menu.component.html',
    styleUrl: './left-menu.component.css',
    standalone: false
})
export class LeftMenuComponent implements OnInit {
  @ViewChild(ModalNotificationSendComponent, { static: true })
  public notificationModal;

  items: MenuItem[];
  toggleAdmin = false;
  currentUrl: string;
  isCollapsed = false;
  userName;

  constructor(private toast: ToastContainerComponent,
    public router: Router,
    private readonly activeRoute: ActivatedRoute,
    public authService: AuthService,
    protected profileService: ProfileService) {
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
    this.profileService.getOne().subscribe((user) => {
      if (user.firstname && user.lastname) {
        this.userName = user.firstname + ' ' + user.lastname;
      } else {
        this.userName = this.authService.getPreferredUsername()
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        console.log('Aktualny URL:', this.currentUrl);
        if (this.currentUrl.includes('admin')) {
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
  public showNotificationModal(): void {
    this.notificationModal.show();
  }

  public isAdmin() {
    return this.authService.hasRole('ROLE_SYSTEM_ADMIN')
  }

  public isDomainAdmin() {
    return this.authService.hasRole('ROLE_DOMAIN_ADMIN')

  }

  public showUserDomain() {
    return !this.isAdmin() && this.isDomainAdmin();
  }
}
