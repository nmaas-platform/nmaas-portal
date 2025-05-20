import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppConfigService, ChangelogService} from '../../service';
import {GitInfo} from '../../model/gitinfo';
import { RecaptchaVisibilityService } from '../../service/recaptcha-visibility.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {

    public gitInfo: GitInfo;

    constructor(private changelogService: ChangelogService,
                private appConfigService: AppConfigService,
            private readonly recaptcha: RecaptchaVisibilityService) {
    }

    ngOnInit() {
        this.recaptcha.showBadge();
        if (this.appConfigService.getShowGitInfo()) {
            this.changelogService.getGitInfo().subscribe(info => this.gitInfo = info);
        }
    }

    ngOnDestroy(): void {
        this.recaptcha.hideBadge();
    }
}
