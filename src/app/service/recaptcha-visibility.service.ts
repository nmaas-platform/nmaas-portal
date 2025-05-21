import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RecaptchaVisibilityService {
  showBadge(): void {
    const badge = document.querySelector('.grecaptcha-badge') as HTMLElement;
    if (badge) {
      badge.style.visibility = 'visible';
    }
  }

  hideBadge(): void {
    const badge = document.querySelector('.grecaptcha-badge') as HTMLElement;
    if (badge) {
      badge.style.visibility = 'hidden';
    }
  }
}
