import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import {ConfigurationService} from '../../service';


@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css'],
    standalone: false
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private auth: AuthService,
              private configService: ConfigurationService) { }

  ngOnInit() {
      const redirectedToProvider = this.auth.logout();
      if (redirectedToProvider) {
          // the provider terminates its SSO session and redirects the browser
          // back to the portal login page - no SPA navigation must follow
          return;
      }
      this.configService.getConfiguration().subscribe(config => {
              this.router.navigate(['/welcome']);
      });
  }

}
