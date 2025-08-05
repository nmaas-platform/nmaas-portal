import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../model';
import {BaseComponent} from '../../common/basecomponent/base.component';
import {DomainService, UserService} from '../../../service';
import {Role, UserRole} from '../../../model/userrole';
import {TranslateService} from '@ngx-translate/core';
import {InternationalizationService} from '../../../service/internationalization.service';
import {AuthService} from '../../../auth/auth.service';

function toEnum(role: string | Role): Role {
  if (typeof role === 'string') {
    return Role[role];
  }
  return role;
}

@Component({
    selector: 'nmaas-preferences',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.css'],
    standalone: false
})
export class PreferencesComponent extends BaseComponent implements OnInit {

  public myDomainNames: Map<number, string> = new Map<number, string>();
  public languages: string[];
  themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ];
  selectedTheme: string = localStorage.getItem('theme-mode')

  @Input()
  public user: User = new User();

  public _errorMessage: string;

  @Output()
  public errorMessageChange: EventEmitter<any> = new EventEmitter();

  @Output()
  public onSave: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  public refresh: EventEmitter<any> = new EventEmitter();

  @Output()
  public userDetailsModeChange: EventEmitter<any> = new EventEmitter();

  @Input()
  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(val) {
    this._errorMessage = val;
  }

  @Input()
  get userDetailsMode() {
    return this.mode;
  }

  set userDetailsMode(val) {
    this.mode = val;
    this.userDetailsModeChange.emit(this.mode);
  }

  constructor( public domainService: DomainService,
               public userService: UserService,
               private translate: TranslateService,
               private languageService: InternationalizationService,
               private authService: AuthService) {
    super();
  }

  setLanguage(language: string) {
    this.userService.setUserLanguage(this.user.id, language).subscribe(() => {
      this.user.selectedLanguage = language;
      localStorage.setItem('lang', language);
      this.translate.use(language);
    });
  }

  public getSupportedLanguages() {
    this.languageService.getEnabledLanguages().subscribe(langs => {
      this.translate.addLangs(langs);
      this.languages = langs;
    });
  }
  getPathToCurrent() {
    return 'assets/images/country/' + this.user.selectedLanguage + '_circle.png';
  }

  ngOnInit(): void {
    this.getSupportedLanguages()
    this.domainService.getMyDomains().subscribe(
        domains => domains.forEach(d => this.myDomainNames.set(d.id, d.name))
    )
  }

  public submit() {
    this.onSave.emit(this.user);
  }

  public onModeChange(): void {
    this.refresh.emit();
  }

  public getNameForDomain(id: number): string {
    return this.myDomainNames.get(id);
  }

  public getFilteredUserRoles(): UserRole[] {
    const globalDomainId = this.domainService.getGlobalDomainId();
    return this.user.roles.filter(ur => ur.domainId !== globalDomainId || toEnum(ur.role) === Role.ROLE_SYSTEM_ADMIN)
  }

  protected onThemeChange(event: any): void {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      if (event.value === 'dark') {
        this.userService.setUserThemeMode(this.user.id, 'dark').subscribe(() => {
          this.authService.refreshToken()
          localStorage.setItem('theme-mode', 'dark')
          htmlElement.classList.add('dark-mode');
        })
      } else {
        this.userService.setUserThemeMode(this.user.id, 'light').subscribe(() => {
          this.authService.refreshToken()
          localStorage.setItem('theme-mode', 'light')
          htmlElement.classList.remove('dark-mode');
        })
      }
    }

  }

}
