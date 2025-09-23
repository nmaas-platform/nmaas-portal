import {Component, OnInit, ViewChild} from '@angular/core';
import {InternationalizationService} from '../../../../service/internationalization.service';
import {Language} from '../../../../model/language';
import {TranslateService} from '@ngx-translate/core';
import {ModalComponent} from '../../../../shared/modal';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {DomainGroup} from '../../../../model/domaingroup';

@Component({
    selector: 'app-languagelist',
    templateUrl: './languagelist.component.html',
    styleUrls: ['./languagelist.component.css'],
    standalone: false
})
export class LanguageListComponent implements OnInit {

  @ViewChild(ModalComponent, { static: true })
  public modal: ModalComponent;

  @ViewChild('rowMenu') rowMenu!: Menu;
  rowMenuItems: MenuItem[] = [];

  public languages: Language[] = [];

  constructor(public languageService: InternationalizationService,
              public translate: TranslateService) { }

  ngOnInit() {
    this.modal.setModalType('error');
    this.modal.setStatusOfIcons(false);
    this.languageService.getAllSupportedLanguages().subscribe(langs => this.languages = langs);
  }

  public changeLanguageState(language: Language) {
    if (language.language !== this.translate.currentLang && language.language !== this.translate.getDefaultLang()) {
      language.enabled = !language.enabled;
      this.languageService.changeSupportedLanguageState(language).subscribe(() => {
        this.languageService.setUpdateRequiredFlag(true);
      }, () => this.modal.show())
    } else {
      this.modal.show();
    }
  }

  openRowMenu(event: Event, lang: Language) {

    this.rowMenuItems = [
      {
        label: this.translate.instant('LANGUAGE_MANAGEMENT.EDIT_BUTTON'),
        routerLink: ['/admin/languages/' + lang.language]
      },
      {
        label: this.translate.instant( 'LANGUAGE_MANAGEMENT.LANGUAGE_DISABLED'),
        command: () => this.changeLanguageState(lang)
      },
      {
        label: this.translate.instant( 'LANGUAGE_MANAGEMENT.LANGUAGE_ENABLED'),
        visible: !lang.enabled,
        command: () => this.changeLanguageState(lang)
      }
    ];

    this.rowMenu.toggle(event);
  }

}
