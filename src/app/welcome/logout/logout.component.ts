import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import {ConfigurationService} from '../../service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private auth: AuthService,
              private configService: ConfigurationService) { }

  ngOnInit() {
      this.auth.logout();
      this.configService.getConfiguration().subscribe(config => {
              this.router.navigate(['/welcome']);
      });
  }

}
