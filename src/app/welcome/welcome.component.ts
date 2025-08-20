import {AppConfigService} from '../service/appconfig.service';
import {AfterContentChecked, AfterViewChecked, Component, OnDestroy, OnInit,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ServiceUnavailableService} from '../service-unavailable/service-unavailable.service';
import { RecaptchaVisibilityService } from '../service/recaptcha-visibility.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css'],
    standalone: false
})
export class WelcomeComponent implements OnInit, AfterViewChecked, AfterContentChecked, OnDestroy {

    private height = 0;

    public autoLogout = false;

    public landingProfile = '';

    darkMode;

    constructor(private appConfig: AppConfigService,
                public router: Router,
                private serviceHealth: ServiceUnavailableService,
                private readonly route: ActivatedRoute,
                private readonly recaptcha: RecaptchaVisibilityService,
                private authService: AuthService,) {
        this.route.queryParams.subscribe(params => {
            console.log(params)
            if (params.logout !== undefined) {
                this.autoLogout = true;
            }
        })
    }

    async ngOnInit() {
        this.updateDarkMode()
        const observer = new MutationObserver(() => this.updateDarkMode());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });


        document.getElementById('global-footer').style.display = 'block';
        await this.serviceHealth.validateServicesAvailability();
        if (!this.serviceHealth.isServiceAvailable) {
            this.router.navigate(['/service-unavailable']);
        }

        if( this.authService.isLogged()) {
            this.router.navigate(['/']);    
        }

        this.landingProfile = this.appConfig.getLandingProfile();
        console.log("Landing profile = ", this.landingProfile)
        this.recaptcha.showBadge();
    }

    ngAfterContentChecked() {
        // this.onResize();
         this.recaptcha.showBadge();
    }

    ngAfterViewChecked() {
        // this.onResize();
         this.recaptcha.showBadge();
    }

    ngOnDestroy(): void {
        this.recaptcha.hideBadge();
    }

    updateDarkMode() {
        this.darkMode = document.querySelector('html').classList.contains('dark-mode');
    }

    public onCloseBanner() {
        this.autoLogout = false;
        this.router.navigate(['welcome/login']);
    }
    
    // As the comment belove said, its very old solution ( working, but may produce problems) If we rebuild the landing page completly, 
    //I would advice to not use onRize // kbeyrowski  

    // onResize() {
    //     // TODO
    //     // rewrite this code, use css instead of js for better performance
    //     this.height = document.getElementById('global-footer').offsetHeight;
    //     const navHeight = document.getElementById('navbar').offsetHeight;
    //     // document.getElementById("welcome-container").style.marginBottom = `${this.height}px`;
    //     // document.getElementById("welcome-container").style.marginTop = `${navHeight + 2}px`;
    //     document.getElementById('login-out').style.maxHeight = `calc(95vh - ${this.height + navHeight + 10}px)`;
    //     // document.getElementById('login-out').style.paddingTop = `${navHeight}`;
    //     if (this.height > 90) {
    //         document.getElementById('global-footer').style.textAlign = 'center';
    //         document.getElementById('login-out').style.maxHeight = `calc(94vh - ${this.height + navHeight + 10}px)`;
    //     } else {
    //         document.getElementById('global-footer').style.textAlign = 'right';
    //     }
    // }
}
