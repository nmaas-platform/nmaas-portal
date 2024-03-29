import {Component, ViewEncapsulation} from '@angular/core';
import {AppConfigService, ConfigurationService} from './service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {ServiceUnavailableService} from './service-unavailable/service-unavailable.service';
import {IdleTimer} from './auth/idle-timer';

@Component({
    selector: 'nmaas-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    config: any;
    private timer: IdleTimer;

    constructor(private appConfigService: AppConfigService, private configService: ConfigurationService,
                private authService: AuthService, private translate: TranslateService,
                private router: Router, private serviceHealth: ServiceUnavailableService) {
    }

    async ngOnInit() {
        if (this.serviceHealth.isServiceAvailable === false) {
            this.router.navigate(['/service-unavailable']);
        }
        this.handleDefaultLanguage();
        this.config = this.appConfigService.config;
        console.debug('Configuration: ' + JSON.stringify(this.config));
        await this.delay(2000);
        console.warn("User logged ? -", this.authService.isLogged())
        if (this.authService.isLogged()) {
                    this.timer = new IdleTimer({
                        timeout: 900, // 15 min
                        onTimeout: () => {
                            this.authService.logout();
                            this.router.navigate(['/welcome'], {queryParams: {logout: 'TIMEOUT'}});
                        }
                    });
                }
    }

    public handleDefaultLanguage(): void {
        if (this.authService.getSelectedLanguage() != null) {
            this.setLanguage(this.authService.getSelectedLanguage());
        } else {
            this.configService.getConfiguration().subscribe(config => {
                this.setLanguage(config.defaultLanguage);
            }, () => {
                this.setLanguage('en');
            });
        }
    }

    private setLanguage(lang: string) {
        this.translate.use(lang);
        this.translate.setDefaultLang(lang);
    }

    private delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}
