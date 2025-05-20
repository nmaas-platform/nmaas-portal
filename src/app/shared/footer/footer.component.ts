import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AppConfigService, ChangelogService} from '../../service';
import {GitInfo} from '../../model/gitinfo';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'nmaas-footer',
  templateUrl: './footer.component.html',
  styleUrls: [ './footer.component.css' ]
})

export class FooterComponent implements OnInit {

  public gitInfo: GitInfo;
  public landingProfile = '';
  public isLoggedIn  = false;

  constructor(private changelogService: ChangelogService, private router: Router, private authService: AuthService,
              public appConfigService: AppConfigService, public translate: TranslateService, private appConfig: AppConfigService) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLogged() ;
    if (this.appConfigService.getShowGitInfo()) {
        this.changelogService.getGitInfo().subscribe(info => this.gitInfo = info);
    }
    this.landingProfile = this.appConfig.getLandingProfile();
    console.log("Landing profile = ", this.landingProfile)
  }

  public moveToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
