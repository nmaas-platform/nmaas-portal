import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeModeService {

  constructor(private authService: AuthService) { }

  public handleDefaultThemeMode(): void {
    if (this.authService.getSelectedThemeMode() != null) {
      localStorage.setItem('theme-mode', this.authService.getSelectedThemeMode())
    } else if (!localStorage.getItem('theme-mode')) {
      localStorage.setItem('theme-mode', 'light')
    }
    this.setThemeMode(localStorage.getItem('theme-mode'))
  }

  public setThemeMode(theme: string): void {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      if (theme === 'dark') {
        htmlElement.classList.add('dark-mode');
      } else {
        htmlElement.classList.remove('dark-mode');
      }
    }
  }
}
