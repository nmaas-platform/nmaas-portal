import {Component, ViewEncapsulation} from '@angular/core';
import {AppConfigService, ConfigurationService} from './service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {ServiceUnavailableService} from './service-unavailable/service-unavailable.service';
import {IdleTimer} from './auth/idle-timer';
import {PrimeNG} from 'primeng/config';
import {ThemeModeService} from './service/theme-mode.service';

@Component({
    selector: 'nmaas-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class AppComponent {

    config: any;
    private timer: IdleTimer;
    public isLoggedIn = null;

    constructor(private appConfigService: AppConfigService, private configService: ConfigurationService,
                public authService: AuthService, private translate: TranslateService,
                private router: Router, private serviceHealth: ServiceUnavailableService,
                private primeNg: PrimeNG,
                private themeModeService: ThemeModeService) {
    }

    async ngOnInit() {
        this.primeNg.ripple.set(true);
        this.isLoggedIn = this.authService.isLogged();
        if (this.serviceHealth.isServiceAvailable === false) {
            this.router.navigate(['/service-unavailable']);
        }
        this.handleDefaultLanguage();
        this.themeModeService.handleDefaultThemeMode()
        this.config = this.appConfigService.config;
        console.debug('Configuration: ' + JSON.stringify(this.config));
        await this.delay(2000);
        console.warn('User logged ? -', this.authService.isLogged())
        this.updateLogin();
        if (this.authService.isLogged()) {
            this.isLoggedIn = true;
            this.timer = new IdleTimer({
                timeout: 900, // 15 min
                onTimeout: () => {
                    this.authService.logout();
                    this.router.navigate(['/welcome'], {queryParams: {logout: 'TIMEOUT'}});
                }
            });
        }
    }

    private updateLogin() {
        this.authService.isLoggedIn$.subscribe(isLogged => {
            console.log('User state update', isLogged);
            this.isLoggedIn = isLogged;
        });
    }

    // public handleDefaultThemeMode(): void {
    //     alert(this.authService.getSelectedThemeMode())
    //     if (this.authService.getSelectedThemeMode() != null) {
    //         localStorage.setItem('theme-mode', this.authService.getSelectedThemeMode())
    //     } else if (!localStorage.getItem('theme-mode')) {
    //         localStorage.setItem('theme-mode', 'light')
    //     }
    //     this.themeModeService.setThemeMode(localStorage.getItem('theme-mode'))
    // }

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

    // private setThemeMode(theme: string): void {
    //     const htmlElement = document.querySelector('html');
    //     if (htmlElement) {
    //         if (theme === 'dark') {
    //             htmlElement.classList.add('dark-mode');
    //         } else {
    //             htmlElement.classList.remove('dark-mode');
    //         }
    //     }
    // }

    private setLanguage(lang: string) {
        this.translate.use(lang);
        this.translate.setDefaultLang(lang);
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
