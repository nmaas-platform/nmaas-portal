import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AppConfigService } from './appconfig.service';

declare global {
    interface Window {
        grecaptcha: any;
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReCaptchaV3Service {

    private siteKey: string;

    constructor(
        private appConfigService: AppConfigService
    ) {
        this.siteKey = this.appConfigService.getSiteKey();
    }

    execute(action: string): Observable<string> {
        return from(
            this.loadRecaptcha()
                .then(() =>
                    window.grecaptcha.execute(this.siteKey, {
                        action
                    })
                )
        );
    }

    private loadRecaptcha(): Promise<void> {
        return new Promise((resolve, reject) => {

            if (window.grecaptcha) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                window.grecaptcha.ready(() => {
                    resolve();
                });
            };

            script.onerror = () => {
                reject('Unable to load reCAPTCHA');
            };

            document.head.appendChild(script);
        });
    }
}
